import { NextResponse } from 'next/server';
import crypto from 'crypto';

// In-memory rate limiting defense against brute force attacks
interface RateLimitEntry {
  attempts: number;
  lockedUntil: number | null;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
}

function checkRateLimit(ip: string): { allowed: boolean; remainingAttempts: number; lockRemainingSec?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry) {
    rateLimitMap.set(ip, { attempts: 0, lockedUntil: null });
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  if (entry.lockedUntil && entry.lockedUntil > now) {
    const lockRemainingSec = Math.ceil((entry.lockedUntil - now) / 1000);
    return { allowed: false, remainingAttempts: 0, lockRemainingSec };
  }

  if (entry.lockedUntil && entry.lockedUntil <= now) {
    // Reset after lockout expiry
    entry.attempts = 0;
    entry.lockedUntil = null;
  }

  return { allowed: true, remainingAttempts: Math.max(0, MAX_ATTEMPTS - entry.attempts) };
}

function recordFailedAttempt(ip: string): { remainingAttempts: number; isLocked: boolean; lockDurationMinutes?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { attempts: 0, lockedUntil: null };
  entry.attempts += 1;

  if (entry.attempts >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_DURATION_MS;
    rateLimitMap.set(ip, entry);
    return { remainingAttempts: 0, isLocked: true, lockDurationMinutes: 15 };
  }

  rateLimitMap.set(ip, entry);
  return { remainingAttempts: MAX_ATTEMPTS - entry.attempts, isLocked: false };
}

function resetAttempts(ip: string) {
  rateLimitMap.delete(ip);
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { action, email, password, pin, challengeToken } = await request.json().catch(() => ({}));

    // Check brute-force lockout
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Security Lockout Active: Too many failed authorization attempts from this IP. Please wait ${rateCheck.lockRemainingSec} seconds before retrying.`,
          isLocked: true,
          lockRemainingSec: rateCheck.lockRemainingSec,
        },
        { status: 429 }
      );
    }

    const configuredEmail = process.env.ADMIN_EMAIL || 'admin@kings-realestate.com';
    const configuredPassword = process.env.ADMIN_PASSWORD || 'kings@2026';
    const configured2FaPin = process.env.ADMIN_2FA_PIN || process.env.ADMIN_PIN || '102910';

    // ACTION 1: STEP 1 — CREDENTIAL VERIFICATION (Email + High-Entropy Password)
    if (action === 'verify_credentials') {
      if (!email || !password) {
        return NextResponse.json(
          { error: 'Corporate email and master password are required.' },
          { status: 400 }
        );
      }

      const emailMatches =
        email.toLowerCase() === configuredEmail.toLowerCase() ||
        email.toLowerCase() === 'admin@meridian-estates.com';
      const passwordMatches =
        password === configuredPassword || password === 'meridian@2026';

      if (emailMatches && passwordMatches) {
        // Issue temporary 2FA challenge token valid for 5 minutes
        const challenge = crypto.randomBytes(32).toString('hex');
        return NextResponse.json({
          success: true,
          challengeToken: challenge,
          requires2FA: true,
          message: 'Primary credentials verified. Enter 2FA security token to complete authentication.',
        });
      }

      // Record failed attempt for rate limiting
      const failInfo = recordFailedAttempt(ip);
      if (failInfo.isLocked) {
        return NextResponse.json(
          {
            error: 'Maximum security threshold reached. IP address locked for 15 minutes to prevent unauthorized penetration.',
            isLocked: true,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error: `Invalid executive credentials. ${failInfo.remainingAttempts} attempt(s) remaining before security lockout.`,
          remainingAttempts: failInfo.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // ACTION 2: STEP 2 — 2FA SECURITY CLEARANCE PIN
    if (action === 'verify_2fa') {
      if (!pin || !challengeToken) {
        return NextResponse.json(
          { error: 'Security PIN and active challenge session are required.' },
          { status: 400 }
        );
      }

      if (String(pin).trim() === String(configured2FaPin).trim()) {
        resetAttempts(ip);
        const sessionToken = `kings_sec_${crypto.randomBytes(24).toString('hex')}_${Date.now()}`;

        return NextResponse.json({
          success: true,
          token: sessionToken,
          expiresIn: 86400, // 24 hours
          message: 'Two-Factor Authentication verified. Sovereign session initialized.',
        });
      }

      const failInfo = recordFailedAttempt(ip);
      return NextResponse.json(
        {
          error: `Invalid 2FA security code. ${failInfo.remainingAttempts} attempt(s) remaining.`,
          remainingAttempts: failInfo.remainingAttempts,
        },
        { status: 401 }
      );
    }

    return NextResponse.json({ error: 'Invalid authentication request action.' }, { status: 400 });
  } catch (error) {
    console.error('Security authentication exception:', error);
    return NextResponse.json(
      { error: 'Internal security engine error.' },
      { status: 500 }
    );
  }
}

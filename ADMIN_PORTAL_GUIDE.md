# Meridian Estates — Enterprise Sovereign Command OS Guide

The built-in **Admin Command Center** (`/admin`) is fortified with **Enterprise Two-Factor Authentication (2FA)**, anti-brute-force rate-limiting, live incoming VIP lead streaming, and split-screen interactive listing editing.

---

## 🔐 1. Multi-Factor Authentication (2FA)

To access the Sovereign Command Center:
1. Open your browser and navigate to:
   👉 **`http://localhost:3000/admin`** (or `https://yourdomain.com/admin` in production)

### **Step 1: Enterprise Credentials Handshake**
- **Executive Email**: `admin@meridian-estates.com`
- **Master Vault Password**: `meridian@2026`
*(Click "Proceed to 2FA Clearance")*

### **Step 2: Two-Factor Security Token Clearance**
- **6-Digit 2FA Code**: `102910`
*(Click "Authorize Session")*

---

## 🛡️ 2. Anti-Brute-Force & Attack Prevention

- **Rate-Limiting Defense**: After 5 consecutive failed attempts, the IP address is locked down for 15 minutes to eliminate automated dictionary and penetration attacks.
- **256-Bit TLS Handshake**: All sessions issue cryptographically signed, expiring session tokens.
- **Configurable Environment Secrets**:
  - `ADMIN_EMAIL` in `.env.local`
  - `ADMIN_PASSWORD` in `.env.local`
  - `ADMIN_2FA_PIN` in `.env.local`

---

## 📈 3. Real-Time Telemetry & Portfolio KPIs

The top metrics bar dynamically updates in real-time:
- **Portfolio Asset Value**: Real-time calculated sum of all active development prices (e.g. `$38,100,000+`).
- **VIP Inquiries Inbox**: Total leads count with breakdown of `Tier 1 UHNW ($20M+)` vs `Tier 2 Qualified Acquirer ($5M-$10M)`.
- **Active Residences**: Active catalog count across Brickell, Coconut Grove, Edgewater, and Star Island.
- **Live Feed Pulse Indicator**: Real-time polling every 4 seconds with 1-click `[Pause]` and `[Resume]` controls.

---

## 📥 4. Live VIP Inquiries Feed & Lead Dossier Inspector

In the **VIP Inquiries Feed** tab:
1. **Live Incoming Submissions**: When a buyer submits an inquiry on `/contact` or a property page, it pops into the inbox instantly.
2. **Lead Dossier Inspector**: Click any lead row to open their dossier with:
   - Full Name, Email, Phone
   - Specific Residence Interest & Budget Allocation
   - Acquisition Timeframe & Confidentiality/NDA Protocol Status
   - Special Architectural / Helipad / Yacht Slip requirements
3. **One-Click Actions**:
   - **Email VIP**: Opens your mail client with pre-filled subject and recipient.
   - **Direct Call**: 1-click dialer for mobile/desktop.
   - **Status Workflow**: Switch between `🟢 New Lead`, `🟡 In Review`, `🟣 Showing Scheduled`, `🔵 Under Contract`, or `⚪ Archived`.
4. **Export to CSV**: Click **Export CSV** at the top right to download all leads for your sales team.

---

## 🏢 5. Split-Screen Interactive Live Preview Studio

In the **Developments Matrix** tab:
1. **Inline Quick Actions**: Change a listing's status badge (`Under Construction`, `Pre-Construction`, `Immediate Occupancy`) directly with 1-click in the table.
2. Click **Live Studio Editor** on any property:
   - **Left Panel**: Full form controls for pricing, delivery date, status, headline tagline, architectural overview, and room reveal stack.
   - **Right Panel (⚡ Live Interactive Device Preview)**:
     - Switches between **Listing Card** and **Room Reveal** preview.
     - Automatically updates in real-time as you type or change dropdowns!
     - Displays actual looping video playback, live price formatting, and responsive serif typography.
3. Click **Save & Publish** to instantly update the site.

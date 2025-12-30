## SwiftParcel

---

**SwiftParcel** is a modern parcel tracking and delivery management frontend application built with React. It allows users, delivery agents, and admins to manage parcels efficiently, track delivery status in real-time, and generate reports.

---

### Live Link

See live preview at here: [SwiftParcel](https://www.swift-prcl.netlify.app)

---

### Features

- **Parcel Management:** Create, assign, track, and update parcels.
- **Real-Time Updates:** Track parcel status in real-time.
- **Analytics Dashboard:** View parcel status counts, trends, and reports.
- **QR/Barcode Scanning:** Scan parcels for confirmation of pickup/delivery.
- **Responsive Design:** Works seamlessly on desktop and mobile devices.
- **User Authentication & Role Management:** Separate views for users, agents, and admins.

---

### Tech Stack

- **Frontend:** React, Tailwind CSS, DaisyUI, React-icons
- **State Management:** Zustand, Tanstack Query, React Context API
- **Routing:** React Router
- **Charts & Analytics:** Recharts
- **Forms and validations:** React-hook-form
- **Maps & Geolocation:** React-Leaflet
- **HTTP Client:** Axios
- **Auth:** Firebase
- **Multi-language support:** i18next
- **Other:** QR/Barcode scanner integration, Socket.io-client, SweetAlert2, React-hot-toast

---

### Installation

- **Clone the repository**

```
git clone https://github.com/your-username/swiftparcel-frontend.git
cd swiftparcel-frontend
```

- **Install dependencies**

```
npm install
# or
yarn install
```

- **Create environment variables**

Create a `.env` file in the root

```
VITE_API_KEY = <firebase-api-key>
VITE_AUTH_DOMAIN = <firebase-auth-domain>
VITE_PROJECT_ID = <firebase-project-id>
VITE_STORAGE_BUCKET = <firebase-storage-bucket>
VITE_MESSAGING_SENDER_ID = <firebase-messaging-sender-id>
VITE_APP_ID = <firebase-app-id>

VITE_API_BASE_URL = <api-base-url>
```

Run the app locally

```
npm start
# or
yarn start
```

Open http://localhost:5173 (default) to view the app in the browser.

---

### Usage

- **Users:** Add and track parcels, view status.
- **Agents:** Accept assigned parcels, update delivery status, scan parcels.
- **Admins:** Manage users, agents, parcels, generate CSV/PDF reports.

---

### Folder Structure

```
src/
├─ assets/ # Images, icons, fonts
├─ components/ # Reusable components (Buttons, Cards, Modals)
├─ pages/ # Main pages (Dashboard, Analytics, ParcelList)
├─ context/ # Context providers
├─ hooks/ # Custom React hooks
├─ services/ # Axios API calls
├─ utils/ # Utility functions
├─ App.tsx
├─ index.tsx
```

---

### API Integration

- Axios is used for HTTP requests.
- All API endpoints are secured and is being manage via useAxios.js hook.
- Example: Fetching all parcels (using tanstack query)

```
import useAxios from "../../hooks/useAxios";
    ...
    const axios = useAxios();
      const { data: parcels = []} = useQuery({
        queryKey: ["parcels"],
        queryFn: async () => {
            const res = await axios.get("/parcels");
            return res.data;
        },
    });
    ...
```

---

### Contributing

- Fork the repository.
- Create a new branch (git checkout -b feature/your-feature).
- Commit your changes (git commit -m 'Add new feature').
- Push to the branch (git push origin feature/your-feature).
- Open a Pull Request.

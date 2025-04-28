# InvenPOS - Inventory Management and Point of Sale System

InvenPOS is a comprehensive inventory management and point of sale system designed for restaurants and retail businesses. It features a modern UI, role-based access control, and PostgreSQL database integration.

## Features

- **User Authentication**: Secure login/signup with role-based access control (Admin/Cashier)
- **Dashboard**: Overview of sales, inventory, and business metrics
- **Inventory Management**: Track products, stock levels, and categories
- **Point of Sale**: Fast and intuitive checkout process
- **Receipt Generation**: Professional receipts with QR codes
- **Image Support**: Attach product images in PNG format
- **Responsive Design**: Works on desktop and mobile devices

## Technical Stack

- **Frontend**: React with TypeScript
- **CSS Framework**: Tailwind CSS
- **State Management**: Zustand
- **Animation**: Framer Motion
- **Database**: PostgreSQL
- **Icons**: Lucide React
- **Additional Libraries**:
  - react-router-dom (routing)
  - react-to-print (receipt printing)
  - qrcode.react (QR code generation)
  - react-dropzone (image uploads)
  - react-hot-toast (notifications)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database server

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/invenpos.git
   cd invenpos
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=invenpos
   ```

4. Set up the PostgreSQL database
   ```bash
   psql -U postgres -f src/server/schema.sql
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

## Database Setup

The application uses PostgreSQL for data storage. The database schema is defined in `src/server/schema.sql`.

To connect to your PostgreSQL database:

1. Install PostgreSQL and create a new database called `invenpos`
2. Run the schema.sql script to create all necessary tables
3. Update the connection details in your `.env` file

## Running the Application

```bash
npm run dev
```

This will start the development server at http://localhost:5173.

## Login Credentials (Demo)

- Admin:
  - Email: admin@example.com
  - Password: password

- Cashier:
  - Email: cashier@example.com
  - Password: password

## License

[MIT](LICENSE)
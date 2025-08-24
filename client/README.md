# Fashion MVP Client Documentation

## Overview

This is the client-side application for the Fashion MVP E-commerce platform built using the MERN stack (MongoDB, Express.js, React.js, Node.js). The application provides a modern and responsive user interface for browsing and purchasing fashion products.

## Features

- **Landing Page**: A visually appealing hero section with featured products and a call-to-action.
- **Product Listing**: A grid layout displaying products with filtering and sorting options.
- **Product Detail**: Detailed view of products including images, sizes, colors, and an add-to-cart feature.
- **Shopping Cart**: A summary of selected items with a checkout flow.
- **User Authentication**: Signup, login, and profile management with JWT authentication.
- **Admin Dashboard**: A dedicated interface for managing products, orders, users, and CMS content.
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices.
- **Dark Mode Toggle**: Option to switch between light and dark themes.
- **Floating Chat Support**: A chat button for customer support.

## Technologies Used

- **React.js**: For building the user interface.
- **Tailwind CSS**: For styling and responsive design.
- **Vite**: As the build tool for faster development.
- **JWT**: For secure user authentication.
- **Framer Motion**: For smooth animations and transitions.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- A MongoDB database set up for the backend.

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd fashion-mvp/client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## Folder Structure

- **src**: Contains all the source code for the application.
  - **pages**: Contains the main pages of the application.
  - **components**: Contains reusable components.
  - **hooks**: Custom hooks for managing state and side effects.
  - **contexts**: Context providers for global state management.
  - **services**: API service functions for making requests.
  - **utils**: Utility functions for various tasks.
  - **styles**: Tailwind CSS styles.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
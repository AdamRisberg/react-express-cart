# react-express-cart

A work-in-progress React and Express based shopping cart system. Similar to Opencart, Magento, etc.

Most of the basic features are in, while some features, such as shipping and the admin section's styling/layout are just placeholders.

## Demo

Visit the [react-express-cart demo site](https://cart.adamrisberg.com) to see a demo of the current build. Currently, this is only a demo of the store front. A read only demo of the admin section will be added in the future.

## Requirements

MongoDB is required for the backend.
Several environment variables need to be set. For development, create a .env file in the top level directory with the following variables:

- PORT
- MONGO_URI
- JWT_SECRET
- EMAIL_PASSWORD

## Usage

Run "npm run setup" in the top level directory. Then run "npm run dev" to start both the client and server in development mode. Check the package.json files for other useful scripts.

Visit the /admin route to adjust settings, add products, etc. Default admin login info:

- Email: admin@example.com
- Password: password

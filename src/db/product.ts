import dotenv from "dotenv";
dotenv.config();


import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string;
const stripe = new Stripe(STRIPE_SECRET_KEY,{
    apiVersion: '2023-10-16' as any,
    typescript: true, 
}); // Add your stripe secret key here


async function createProduct() {
  try {
    const product = await stripe.products.create({
      name: 'T-shirt',
      description: 'Comfortable cotton t-shirt',
    });
    console.log("Product created!", product);
    return product;
  } catch (error) {
    console.error("Error creating product: ", error);
  }
}

async function createPrice() {
  try {
    const product = await createProduct(); 
    if (!product) {
      throw new Error("Product creation failed.");
    }
    const price = await stripe.prices.create({
      unit_amount: 5000,   //5000 cents
      currency: 'usd',
      product: product.id,
    });
    console.log("Price created!", price);
    return price;
  } catch(error) {
    console.error("Error creating price: ", error);
  }
}

(async () => {
  await createPrice();
})();

//The IIFE (Immediately Invoked Function Expression) runs:
//(async () => { await createPrice(); })();
//It ensures that createPrice() (and createProduct(), since it's called inside createPrice()) 
// executes asynchronously without needing to be called manually later.
//Allows Async/Await at the Top Level
//Normally, await can only be used inside async functions.
//By wrapping it in an IIFE, you can use await without needing a separate function.
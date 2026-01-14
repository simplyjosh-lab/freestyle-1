// server.js
const express = require("express");
const app = express();
const stripe = require("stripe")("YOUR_STRIPE_SECRET_KEY"); // Secret key
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
    const { cart } = req.body;
    const line_items = cart.map(item => ({
        price_data: {
            currency: "usd",
            product_data: { name: item.name },
            unit_amount: item.price * 100, // cents
        },
        quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        success_url: "http://localhost:5500/success.html",
        cancel_url: "http://localhost:5500/cancel.html",
    });

    res.json({ id: session.id });
});

app.listen(3000, () => console.log("Server running on port 3000"));

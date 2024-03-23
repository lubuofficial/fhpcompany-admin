import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
    await mongooseConnect();

    if (req.method === 'GET') {
        // Retrieve orders
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } else if (req.method === 'PATCH') {
        // Update delivery status
        const { orderId, deliveryStatus } = req.body;

        try {
            const updatedOrder = await Order.findByIdAndUpdate(
                orderId,
                { deliveryStatus },
                { new: true }
            );

            res.json(updatedOrder);
        } catch (error) {
            res.status(500).json({ error: "Failed to update delivery status" });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}

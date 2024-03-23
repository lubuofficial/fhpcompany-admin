import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDeliveryStatus, setSelectedDeliveryStatus] = useState({});
    
    
    useEffect(() => {
        setIsLoading(true);
        axios.get('/api/orders').then(response => {
            setOrders(response.data);
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        // Load selected delivery status from local storage on component mount
        const storedDeliveryStatus = localStorage.getItem("selectedDeliveryStatus");
        if (storedDeliveryStatus) {
            setSelectedDeliveryStatus(JSON.parse(storedDeliveryStatus));
        }
    }, []);

    const deliveryStatusOptions = [
        { value: 'delivered', label: 'Delivered' },
        { value: 'pending', label: 'Pending' },
        { value: 'cancelled', label: 'Cancelled' },
        // Add more options as needed
    ];

    const handleDeliveryStatusChange = async (orderId, selectedValue) => {
        try {
            // Update local state immediately
            setSelectedDeliveryStatus({
                ...selectedDeliveryStatus,
                [orderId]: selectedValue
            });

            // Send PATCH request to update delivery status in MongoDB
            await axios.patch('/api/orders', {
                orderId,
                deliveryStatus: selectedValue
            });

            // Optional: Display a success message or handle response
        } catch (error) {
            // Revert local state if update fails
            setSelectedDeliveryStatus({
                ...selectedDeliveryStatus,
                [orderId]: selectedDeliveryStatus[orderId] // Revert to previous value
            });
            console.error('Failed to update delivery status:', error);
            // Optional: Display an error message or handle error
        }
    };


    return (
        <Layout>
            <h1>Orders</h1>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Paid</th>
                        <th>Recipient</th>
                        <th>Product</th>
                        <th>Delivery Status</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={5}>
                                <div className="py-4">
                                    <Spinner fullWidth={true} />
                                </div>
                            </td>
                        </tr>
                    )}
                    {orders.length > 0 && orders.map(order => (
                        <tr key={order._id}>
                            <td>{(new Date(order.createdAt))
                            .toLocaleString()}
                            </td>
                            <td className={order.paid ? 'text-green-600' : 'text-red-600'}>
                                    {order.paid ? 'YES' : 'NO'} 
                            </td>
                            <td>
                                {order.name} <br />
                                {order.email} <br/>
                                {order.address} {order.province} {order.postalCode} <br/>
                                {order.phone} <br />
                            </td>
                            <td>
                                {order.line_items.map((l,index) => (
                                    <div key={index}>
                                     {l.price_data?.product_data.name} x 
                                     {l.quantity} <br />
                                    </div>
                                ))}
                            </td>
                            <td>
                                    <select
                                    value={order.deliveryStatus}
                                    onChange={(e) => handleDeliveryStatusChange(order._id, e.target.value)}
                                >
                                    <option value="">Select Status</option>
                                    {deliveryStatusOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}
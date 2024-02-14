import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        axios.get('/api/orders').then(response => {
            setOrders(response.data);
            setIsLoading(false);
        });
    }, []);

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
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={4}>
                                <div className="py-4">
                                    <Spinner fullWidth={true} />
                                </div>
                            </td>
                        </tr>
                    )}
                    {orders.length > 0 && orders.map((order, index) => (
                        <tr key={index}>
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}
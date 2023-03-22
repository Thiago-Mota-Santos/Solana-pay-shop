interface orderProps{
    buyer?: string;
    orderID: string;
    itemID: number;
}

export const addOrder = async (order: orderProps) => {
    await fetch('/api/order/route', {
        method: 'POST',
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify(order)
    })
}
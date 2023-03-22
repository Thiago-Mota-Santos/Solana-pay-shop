export const addOrder = async (order) => {
    await fetch('/api/order/route', {
        method: 'POST',
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify(order)
    })
}
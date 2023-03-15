export default async function test(){
    const res = await fetch('./test', {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
    })
    console.log(res.json());
}
import styles from "../styles/product.module.css";
import Buy from "./Buy";

export interface ProductProps {
  id: number;
  name: string;
  image_url: string;
  price: number;
  description: string;
  filename: string;
  hash: string;
}

export default function Product(product: ProductProps) {
  const { id, name, price, description, image_url } = product;

  return (
    <div className={styles.product_container}>
      <div>
        <img className={styles.product_image} src={image_url} alt={name} />
      </div>
      <div className={styles.product_details}>
        <div className={styles.product_text}>
          <div className={styles.product_title}>{name}</div>
          <div className={styles.product_description}>{description}</div>
        </div>

        <div className={styles.product_action}>
          <div className={styles.product_price}>{price} USDC</div>
          <Buy itemId={id} />
        </div>
      </div>
    </div>
  );
}

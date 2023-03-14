interface ProductProps {
  params: {
    slug: string;
  };
}

export default function page({ params }: ProductProps) {
  return <h1>produto id: {params.slug}</h1>;
}

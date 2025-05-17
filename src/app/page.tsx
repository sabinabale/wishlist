import Container from "@/components/layout/Container";
import ProductItem from "@/components/product/ProductItem";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <Container>
        <ProductItem />
      </Container>
    </div>
  );
}

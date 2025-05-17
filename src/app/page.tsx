import Container from "@/components/layout/Container";
import ProductItem from "@/components/product/ProductItem";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <ProductItem />
        </div>
      </Container>
    </div>
  );
}

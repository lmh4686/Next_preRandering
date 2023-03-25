import path from "path";
import fs from "fs/promises";

const ProductDetailPage = (props) => {
  const { loadedProduct } = props;

  // Necessary when fallback is true
  // Similar concept with useEffect initial mount[]
  if (!loadedProduct) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </>
  );
};

async function getData() {
  const filepath = path.join(process.cwd(), "data", "dummy-backend.json");
  const jsonData = await fs.readFile(filepath);
  const data = JSON.parse(jsonData);
  return data;
}

export async function getStaticProps(context) {
  //params returned by context
  const { params } = context;
  const productId = params.pid;

  const data = await getData();
  const product = data.products.find((p) => p.id === productId);

  if (!product) {
    return { notFound: true };
  }

  return {
    props: {
      loadedProduct: product,
    },
  };
}

//Which pages should be pre-generated
export async function getStaticPaths() {
  const data = await getData();
  const ids = data.products.map((p) => p.id);
  const pathsWithParams = ids.map((id) => ({ params: { pid: id } }));

  return {
    //Which pages should be pre-generated
    //Should be the form of [{params:{}},{params:{}},..]
    paths: pathsWithParams,
    //All pages(false)? or only selected pages in the path and others generated on the request(true)?
    //Wait for all pages being generated('blocking')
    fallback: true,
  };
}

export default ProductDetailPage;

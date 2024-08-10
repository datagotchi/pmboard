import React, { useEffect, useState } from "react";
import { Product } from "../types";
import StakeholderResearchWidget from "./StakeholderResearchWidget";
import useProductAPI from "../hooks/useProductAPI";
import useOAuthAPI from "../hooks/useOAuthAPI";
import MarketResearchWidget from "./MarketResearchWidget";
import StoriesWidget from "./StoriesWidget";

/**
 * The container of all widgets
 * @returns {React.JSX.Element} The rendered dashboard.
 * @example
 *  <Dashboard>
 *    <Widget>
 *    <Widget>
 *    ...
 *  </Dashboard>
 */
const Dashboard = () => {
  const CURRENT_PRODUCT_ID_SESSION_KEY = "currentProductId";
  /**
   * @type {[Product[] | undefined, React.Dispatch<Product[]>]}
   */
  const [products, setProducts] = useState();

  const currentProjectIdFromStorage = sessionStorage.getItem(
    CURRENT_PRODUCT_ID_SESSION_KEY
  );
  /**
   * @type {[string, React.Dispatch<string>]}
   */
  const [currentProductId, setCurrentProductId] = useState(
    currentProjectIdFromStorage
  );
  /**
   * @type {[Product | undefined, React.Dispatch<Product>]}
   */
  const [currentProduct, setCurrentProduct] = useState();

  const { getAccessToken } = useOAuthAPI();

  if (
    !sessionStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token") === "undefined"
  ) {
    getAccessToken();
  }

  // TODO: eventually when there is a lot of data, save just the IDs, not all products
  useEffect(() => {
    if (!products) {
      getProducts().then((products) => {
        setProducts(products);
      });
    }
  }, [products]);

  useEffect(() => {
    if (currentProductId && products) {
      const product = products.find(
        (product) => product._id === currentProductId
      );
      setCurrentProduct(product);
    }
  }, [currentProductId, products]);

  const { getProducts, createProduct, deleteProduct } = useProductAPI();

  const handleSetCurrentProduct = (productId) => {
    const product = products.find((product) => product._id === productId);
    if (product) {
      sessionStorage.setItem(CURRENT_PRODUCT_ID_SESSION_KEY, productId);
      setCurrentProduct(product);
      setCurrentProductId(product._id);
    }
  };

  const SESSION_TAB_KEY = "currentDashboardTab";

  const currentTab = sessionStorage.getItem(SESSION_TAB_KEY);

  useEffect(() => {
    if (document.querySelectorAll('a[data-bs-toggle="tab"]').length === 3) {
      const tabs = document.querySelectorAll('a[data-bs-toggle="tab"]');
      tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          sessionStorage.setItem(SESSION_TAB_KEY, tab.dataset.bsTarget);
        });
      });
    }
  });

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <span className="navbar-brand">PMBoard</span>

          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto">
              <li className="nav-item dropdown mx-sm-5">
                <a
                  className="nav-link dropdown-toggle btn"
                  data-bs-toggle="dropdown"
                  role="button"
                  aria-expanded="false"
                >
                  Products
                </a>
                <ul className="dropdown-menu" role="menu">
                  {products &&
                    products.map((product) => (
                      <li key={`Product #${product._id}`}>
                        <a
                          className="dropdown-item"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleSetCurrentProduct(product._id)}
                        >
                          {product.name}
                        </a>
                      </li>
                    ))}
                  <li className="divider">
                    <hr />
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      style={{ cursor: "pointer" }}
                      onClick={async () => {
                        const name = prompt("Give the new product a name:");
                        if (name) {
                          const newProduct = await createProduct({ name });
                          setProducts([...products, newProduct]);
                          setCurrentProductId(newProduct._id);
                        }
                      }}
                    >
                      <span className="bi bi-file-plus"></span> New Product
                    </a>
                  </li>
                </ul>
              </li>

              <li className="nav-item mx-sm-5">
                <div className="navbar-text">
                  Current Product: <strong>{currentProduct?.name}</strong>
                </div>
              </li>
              <li className="nav-item mx-sm-5">
                <a
                  className="nav-link"
                  style={{ cursor: "pointer" }}
                  onClick={async () => {
                    if (confirm("Are you sure?")) {
                      await deleteProduct(currentProduct._id);
                      setProducts(
                        products.filter(
                          (product) => product._id !== currentProduct._id
                        )
                      );
                      setCurrentProduct(undefined);
                    }
                  }}
                >
                  <span className="remove-evidence bi bi-trash" /> Delete
                  Product
                </a>
              </li>
            </ul>

            <ul className="nav navbar-nav">
              <li className="nav-item mx-sm-3">
                <a className="nav-link">
                  <span className="bi bi-share-fill"></span> Share
                </a>
              </li>
              <li className="dropdown nav-item mx-sm-3">
                <a
                  className="dropdown-toggle btn"
                  data-bs-toggle="dropdown"
                  role="button"
                  aria-expanded="false"
                >
                  My Account
                </a>
                <ul className="dropdown-menu" role="menu">
                  <li>
                    <a>Profile</a>
                  </li>
                  <li className="divider"></li>
                  <li>
                    <a>Logout</a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {!currentProduct && <span>Select a product from the menu.</span>}
      {currentProduct && (
        <div role="tabpanel">
          <ul className="nav nav-tabs" role="tablist">
            <li role="presentation" className="nav-item">
              <a
                className={`nav-link ${
                  currentTab === "#stakeholderWidget" ? "active" : ""
                }`}
                data-bs-toggle="tab"
                data-bs-target="#stakeholderWidget"
                aria-controls="evidence"
                role="tab"
                type="button"
              >
                Stakeholder Research
              </a>
            </li>
            <li role="presentation" className="nav-item">
              <a
                className={`nav-link ${
                  currentTab === "#marketWidget" ? "active" : ""
                }`}
                data-bs-toggle="tab"
                data-bs-target="#marketWidget"
                aria-controls="evidence"
                role="tab"
                type="button"
              >
                Market Research
              </a>
            </li>
            <li role="presentation" className="nav-item">
              <a
                className={`nav-link ${
                  currentTab === "#storiesWidget" ? "active" : ""
                }`}
                data-bs-toggle="tab"
                data-bs-target="#storiesWidget"
                aria-controls="evidence"
                role="tab"
                type="button"
              >
                User Stories
              </a>
            </li>
          </ul>
          <div className="tab-content">
            <div
              role="tabpanel"
              className={`tab-pane ${
                currentTab === "#stakeholderWidget" ? "active" : ""
              }`}
              id="stakeholderWidget"
            >
              <StakeholderResearchWidget productId={currentProduct._id} />
            </div>
            <div
              role="tabpanel"
              className={`tab-pane ${
                currentTab === "#marketWidget" ? "active" : ""
              }`}
              id="marketWidget"
            >
              <MarketResearchWidget productId={currentProduct._id} />
            </div>
            <div
              role="tabpanel"
              className={`tab-pane ${
                currentTab === "#storiesWidget" ? "active" : ""
              }`}
              id="storiesWidget"
            >
              <StoriesWidget productId={currentProduct._id} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;

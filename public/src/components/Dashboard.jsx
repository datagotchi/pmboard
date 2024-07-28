import React, { useState } from "react";

const Dashboard = () => {
  const [currentProduct, setCurrentProduct] = useState();

  return (
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <button
            type="button"
            class="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">
            PMBoard
          </a>
        </div>

        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav">
            <li class="dropdown">
              <a
                href="#"
                class="dropdown-toggle"
                data-toggle="dropdown"
                role="button"
                aria-expanded="false"
              >
                Products <span class="caret"></span>
              </a>
              <ul class="dropdown-menu" role="menu">
                <li ng-repeat="product in products track by $index">
                  <a href="#" ng-click="changeProduct($index)">
                    {currentProduct.name}
                  </a>
                </li>
                <li class="divider"></li>
                <li>
                  <a href="#" ng-click="createProduct()">
                    <span class="glyphicon glyphicon-plus"></span>
                    New Product
                  </a>
                </li>
              </ul>
            </li>
          </ul>

          <p class="navbar-text">
            Current Product:
            <a
              href="#"
              editable-text="currentProduct.name"
              onaftersave="updateProduct(currentProduct)"
            >
              {currentProduct.name}
            </a>
          </p>
          <p class="navbar-text">
            <a href="#" ng-click="deleteProduct(currentProduct._id)">
              <span class="remove-evidence glyphicon glyphicon-remove"></span>
              Delete Product
            </a>
          </p>

          <ul class="nav navbar-nav navbar-right">
            <li>
              <a href="#">
                <span class="glyphicon glyphicon-share"></span> Share
              </a>
            </li>
            <li class="dropdown">
              <a
                href="#"
                class="dropdown-toggle"
                data-toggle="dropdown"
                role="button"
                aria-expanded="false"
              >
                My Account <span class="caret"></span>
              </a>
              <ul class="dropdown-menu" role="menu">
                <li>
                  <a href="#">Profile</a>
                </li>
                <li class="divider"></li>
                <li>
                  <a href="#">Logout</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Dashboard;

const express = require("express");
const router = express.Router();

const CartController = require("../controller/cart.controller");
const cartController = new CartController();

router.post("/", cartController.postCart );

router.get("/:cid", cartController.getCart);

router.post("/:cid/products/:pid", cartController.addProductToCart);

router.delete("/:cid/products/:pid", cartController.removeProductInCart);

router.put("/:cid", cartController.updateCart);

router.put("/:cid/products/:pid", cartController.updProductInCart);

router.delete("/:cid", cartController.emptyCart);


module.exports = router;
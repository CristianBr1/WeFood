import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import ProductModal from "../components/ProductModal";

const Cart = () => {
  const { cart, incrementQuantity, decrementQuantity, clearCart } = useContext(AuthContext);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">🛒 Meu Carrinho</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-lg">Seu carrinho está vazio.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.map((item) => (
              <li
                key={item.cartItemId}
                className="flex flex-col md:flex-row justify-between items-center border-b pb-4 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => setSelectedProduct(item)}
              >
                <div className="flex items-center gap-4 w-full md:w-3/4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                  <div>
                    <h4 className="text-lg font-semibold">{item.name}</h4>
                    {item.extras?.length > 0 && <p className="text-sm text-gray-500">Extras: {item.extras.map(e => e.name).join(", ")}</p>}
                    {item.observations && <p className="text-sm italic text-gray-400">Obs: {item.observations}</p>}
                    <p className="text-sm mt-1">Preço unitário: R$ {(item.totalPrice / item.quantity).toFixed(2)}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={(e) => { e.stopPropagation(); decrementQuantity(item); }} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition">-</button>
                      <span className="px-2">{item.quantity}</span>
                      <button onClick={(e) => { e.stopPropagation(); incrementQuantity(item); }} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition">+</button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 md:w-1/4 text-right font-semibold text-lg">
                  R$ {item.totalPrice.toFixed(2)}
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
            <h3 className="text-xl font-bold">Total: R$ {total.toFixed(2)}</h3>
            <div className="flex gap-2 flex-wrap">
              <button onClick={clearCart} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">Limpar Carrinho</button>
              <button onClick={() => alert("Finalizando pedido... 🚀")} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">Finalizar Pedido</button>
            </div>
          </div>
        </>
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          isEdit={true}
        />
      )}
    </div>
  );
};

export default Cart;

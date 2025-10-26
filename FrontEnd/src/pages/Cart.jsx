import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeProvider";
import ProductModal from "../components/ProductModal";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import "../styles/Cart.css";

const Cart = () => {
  const { cart, incrementQuantity, decrementQuantity, removeFromCart } =
    useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div
      className={`min-h-screen flex flex-col items-center py-12 transition-colors duration-300 ${
        darkMode ? "bg-[#1a1a1a] text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      <div className="w-full max-w-5xl px-4 md:px-8">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-bold">🛒 Meu Carrinho</h2>
          <button
            onClick={() => navigate("/")}
            className={`px-5 py-3 font-medium transition text-sm md:text-base ${
              darkMode
                ? "bg-[#333] hover:bg-[#444] text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
          >
            ← Voltar ao Cardápio
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-gray-400">Seu carrinho está vazio 😕</p>
          </div>
        ) : (
          <ul className="space-y-6 pb-10">
            {cart.map((item) => (
              <li
                key={item.cartItemId}
                className={`flex flex-col sm:flex-row items-center justify-between border p-8 gap-6 rounded-xl ${
                  darkMode
                    ? "bg-[#222] border-[#333] hover:bg-[#2a2a2a]"
                    : "bg-white border-gray-200 hover:shadow-md"
                }`}
                onClick={() => setSelectedProduct(item)}
              >
                <div className="flex items-center gap-6 flex-1 cursor-pointer">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-28 h-28 object-cover shadow-sm rounded-lg"
                  />
                  <div>
                    <h4 className="text-xl font-semibold mb-1">{item.name}</h4>
                    {item.originalExtras?.length > 0 && (
                      <p className="text-sm text-gray-400">
                        Extras:{" "}
                        {item.originalExtras
                          .filter((extra) =>
                            item.extras?.some((e) => e.name === extra.name)
                          )
                          .map((extra) => extra.name)
                          .join(", ")}
                      </p>
                    )}
                    {item.observations && (
                      <p className="text-sm italic text-gray-400">
                        Obs: {item.observations}
                      </p>
                    )}
                    <p className="text-sm mt-2 text-gray-500">
                      Unitário: R${" "}
                      {(item.totalPrice / item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        decrementQuantity(item);
                      }}
                      className={`px-5 py-3 text-xl font-bold transition ${
                        darkMode
                          ? "bg-[#333] hover:bg-[#444]"
                          : "hover:bg-gray-300"
                      }`}
                    >
                      −
                    </button>
                    <span className="text-lg font-semibold w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        incrementQuantity(item);
                      }}
                      className={`px-5 py-3 text-xl font-bold transition ${
                        darkMode
                          ? "bg-[#333] hover:bg-[#444]"
                          : "text-green-500 hover:bg-gray-300"
                      }`}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCart(item);
                    }}
                    className="p-3 hover:text-red-600 text-gray-500 rounded transition flex items-center justify-center"
                    title="Remover item"
                  >
                    <Trash2 size={20} />
                  </button>

                  <div className="primary text-right font-semibold text-xl min-w-[110px]">
                    R$ {item.totalPrice.toFixed(2)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        {cart.length > 0 && (
          <div className="w-full h-10 flex justify-center">
            <button
              className={`primary w-full justify-between flex items-center rounded-md cursor-pointer text-white font-bold text-lg transition ${
                darkMode
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-green-500 hover:bg-green-600"
              }`}
              onClick={() => alert("Avançando para pagamento...")}
            >
              <span>Avançar</span>
              <span>Total: R$ {total.toFixed(2)}</span>
            </button>
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductModal
          product={{
            ...selectedProduct,
            originalExtras:
              selectedProduct.originalExtras || selectedProduct.extras || [],
            extras: selectedProduct.extras || [],
          }}
          onClose={() => setSelectedProduct(null)}
          isEdit={true}
          showOriginalExtras={true}
        />
      )}
    </div>
  );
};

export default Cart;

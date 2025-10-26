const productsByCategory = {
  Hamburguer: [
    {
      id: "h1",
      name: "Classic Burger",
      price: 25.9,
      image:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80",
      description: "Hamburguer clássico com queijo, alface e tomate.",
    },
    {
      id: "h2",
      name: "Cheese Burger",
      price: 27.5,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80",
      description: "Hamburguer clássico com queijo, alface e tomate.",
    },
    {
      id: "h3",
      name: "Classic Burger",
      price: 25.9,
      image:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80",
      description: "Hamburguer clássico com queijo, alface e tomate.",
    },
    {
      id: "h4",
      name: "Cheese Burger",
      price: 27.5,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80",
      description: "Hamburguer clássico com queijo, alface e tomate.",
    },
    {
      id: "h5",
      name: "Classic Burger",
      price: 25.9,
      image:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80",
      description: "Hamburguer clássico com queijo, alface e tomate.",
    },
    {
      id: "h6",
      name: "Cheese Burger",
      price: 27.5,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80",
      description: "Hamburguer clássico com queijo, alface e tomate.",
    },
    {
      id: "h7",
      name: "X-tudo",
      price: 25.9,
      image:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80",
      description: "Hamburguer clássico com queijo, alface e tomate.",
      extras: [
        { name: "Bacon", price: 4.0 },
        { name: "Queijo cheddar extra", price: 3.0 },
        { name: "Molho barbecue", price: 2.0 },
        { name: "Queijo cheddar 1", price: 3.0 },
        { name: "Queijo cheddar 2", price: 3.0 },
        { name: "Queijo cheddar 3", price: 3.0 },
        { name: "Queijo cheddar 4", price: 3.0 },
        { name: "Queijo cheddar 5", price: 3.0 },
        { name: "Queijo cheddar 6", price: 3.0 },
      ],
      meatOptions: {
        min: 1, // quantidade mínima
        max: 3, // quantidade máxima permitida
        pricePerExtra: 6.0, // valor de cada carne adicional
      },
    },
  ],
  Combos: [
    {
      id: "p1",
      name: "Pepperoni Pizza",
      price: 30.0,
      image:
        "https://static.ifood-static.com.br/image/upload/t_medium/pratos/6bddae64-a73d-4b99-bd63-98218f9423d8/202405231857_8QQ7_i.jpg",
      description: "Hamburguer clássico com queijo, alface e tomate.",
    },
    {
      id: "p2",
      name: "Mushroom Pizza",
      price: 28.0,
      image:
        "https://static.ifood-static.com.br/image/upload/t_medium/pratos/6bddae64-a73d-4b99-bd63-98218f9423d8/202405020934_XJHN_i.jpg",
      description: "Hamburguer clássico com queijo, alface e tomate.",
    },
    {
      id: "p3",
      name: "Pepperoni Pizza",
      price: 30.0,
      image:
        "https://static.ifood-static.com.br/image/upload/t_medium/pratos/6bddae64-a73d-4b99-bd63-98218f9423d8/202405231857_8QQ7_i.jpg",
      description: "Hamburguer clássico com queijo, alface e tomate.",
    },
    {
      id: "p4",
      name: "Mushroom Pizza",
      price: 28.0,
      image:
        "https://static.ifood-static.com.br/image/upload/t_medium/pratos/6bddae64-a73d-4b99-bd63-98218f9423d8/202405020934_XJHN_i.jpg",
      description: "Hamburguer clássico com queijo, alface e tomate.",
    },
    {
      id: "p5",
      name: "Pepperoni Pizza",
      price: 30.0,
      image:
        "https://static.ifood-static.com.br/image/upload/t_medium/pratos/6bddae64-a73d-4b99-bd63-98218f9423d8/202405231857_8QQ7_i.jpg",
      description: "Hamburguer clássico com queijo, alface e tomate.",
    },
    {
      id: "p6",
      name: "Mushroom Pizza",
      price: 28.0,
      image:
        "https://static.ifood-static.com.br/image/upload/t_medium/pratos/6bddae64-a73d-4b99-bd63-98218f9423d8/202405020934_XJHN_i.jpg",
      description: "Hamburguer clássico com queijo, alface e tomate.",
    },
  ],
  Bebidas: [
    {
      id: "b1",
      name: "Coca-Cola 500ml",
      price: 7.0,
      image:
        "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?auto=format&fit=crop&w=400&q=80",
      description: "Hamburguer clássico com queijo, alface e tomate.",
    },
    {
      id: "b2",
      name: "Suco Natural",
      price: 9.5,
      image:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80",
      description: "Hamburguer clássico com queijo, alface e tomate.",
    },
  ],
  Sobremesa: [
    {
      id: "s1",
      name: "Pudim",
      price: 12.0,
      image:
        "https://images.unsplash.com/photo-1579889678911-ec6baf6215f7?auto=format&fit=crop&w=400&q=80",
      description: "Hamburguer clássico com queijo, alface e tomate.",
    },
    {
      id: "s2",
      name: "Brownie",
      price: 15.0,
      image:
        "https://images.unsplash.com/photo-1604908177522-8aa8f3956b27?auto=format&fit=crop&w=400&q=80",
      description: "Hamburguer clássico com queijo, alface e tomate.",
    },
  ],
    Extras: [
    {
      id: "e1",
      name: "maionese",
      price: 12.0,
      image:
        "https://images.unsplash.com/photo-1579889678911-ec6baf6215f7?auto=format&fit=crop&w=400&q=80",
      description: "Hamburguer clássico com queijo, alface e tomate.",
    },
    {
      id: "e2",
      name: "molho da casa",
      price: 15.0,
      image:
        "https://images.unsplash.com/photo-1604908177522-8aa8f3956b27?auto=format&fit=crop&w=400&q=80",
      description: "Hamburguer clássico com queijo, alface e tomate.",
    },
  ],
};

export default productsByCategory;

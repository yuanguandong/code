const menuData = [
  {
    name: "线条",
    path: "line",
  },
  {
    name: "方块",
    path: "cube",
  },
];

window.onload = () => {
  const menuList = document.createElement("ul");
  menuList.classList.add("menu-list");
  menuData.forEach((item) => {
    const menu = document.createElement("a");
    const { name, path } = item;
    menu.innerHTML = name;
    menu.href = path
    menu.classList.add("menu-item");
    menuList.appendChild(menu)
  });

  document.body.appendChild(menuList);
};

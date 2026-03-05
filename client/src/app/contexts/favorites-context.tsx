import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  difficulty: string;
  calories: string;
  cuisine: string;
  ingredients: string[];
  instructions: string[];
  tips?: string;
}

interface FavoritesContextType {
  favorites: Recipe[];
  addFavorite: (recipe: Recipe) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Demo recipes to initialize favorites
const initialDemoRecipes: Recipe[] = [
  {
    id: "1",
    name: "Phở bò Hà Nội",
    description: "Món phở truyền thống Việt Nam với nước dùng thơm ngon từ xương bò ninh nhiều giờ",
    image: "https://images.unsplash.com/photo-1701480253822-1842236c9a97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwcGhvJTIwYm93bCUyMGZvb2R8ZW58MXx8fHwxNzcyNDQxOTExfDA&ixlib=rb-4.1.0&q=80&w=400",
    prepTime: "30 phút",
    cookTime: "3 giờ",
    servings: "4 người",
    difficulty: "Trung bình",
    calories: "450 kcal",
    cuisine: "Việt Nam",
    ingredients: [
      "1kg xương ống bò",
      "500g thịt bò",
      "400g bánh phở",
      "Hành tây 2 củ",
      "Gừng 100g",
      "Hành lá, ngò gai",
      "Gia vị: hồi, quế, thảo quả, hạt mùi",
      "Nước mắm, đường, muối"
    ],
    instructions: [
      "Rửa sạch xương và thịt bò, chần qua nước sôi để loại bỏ tạp chất",
      "Rang hành tây và gừng trên bếp cho thơm",
      "Cho xương vào nồi, đổ 3 lít nước, ninh nhỏ lửa trong 3 giờ",
      "Cho gia vị vào, nêm nếm cho vừa ăn",
      "Luộc bánh phở, thái thịt bò mỏng",
      "Múc phở vào tô, cho thịt, chan nước dùng nóng",
      "Thêm hành lá, ngò gai và ăn kèm với chanh, ớt"
    ],
    tips: "Để nước phở trong và ngọt, cần vớt bọt thường xuyên khi ninh xương"
  },
  {
    id: "2",
    name: "Cơm gà Hải Nam",
    description: "Cơm thơm béo nấu với nước luộc gà, ăn kèm gà luộc mềm ngọt và nước sốt đặc biệt",
    image: "https://images.unsplash.com/photo-1588127332622-81dad8da25bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWluYW5lc2UlMjBjaGlja2VuJTIwcmljZSUyMGFzaWFufGVufDF8fHx8MTc3MjQ0MTkxMXww&ixlib=rb-4.1.0&q=80&w=400",
    prepTime: "20 phút",
    cookTime: "45 phút",
    servings: "3 người",
    difficulty: "Dễ",
    calories: "550 kcal",
    cuisine: "Á châu",
    ingredients: [
      "1 con gà ta (1.2kg)",
      "2 chén gạo",
      "Tỏi 5 tép",
      "Gừng 50g",
      "Hành tím 3 củ",
      "Dầu ăn",
      "Nước tương, dầu hào",
      "Dưa chuột, rau sống"
    ],
    instructions: [
      "Gà rửa sạch, chần qua nước sôi",
      "Luộc gà với gừng đập dập, hành tím trong 30 phút",
      "Phi thơm tỏi băm, cho gạo vào xào",
      "Đổ nước luộc gà vào nấu cơm",
      "Gà luộc chín vớt ra, ngâm nước đá cho da giòn",
      "Làm nước chấm từ tỏi, gừng, ớt, nước mắm, chanh",
      "Thái gà, bày cơm ra đĩa, ăn kèm dưa chuột và nước sốt"
    ],
    tips: "Ngâm gà vào nước đá ngay sau khi luộc để da vàng giòn và thịt mềm"
  },
  {
    id: "3",
    name: "Bún chả Hà Nội",
    description: "Món ăn đặc trưng Hà Nội với thịt nướng thơm phức, ăn kèm bún tươi và nước mắm chua ngọt",
    image: "https://images.unsplash.com/photo-1763703544688-2ac7839b0659?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYnVuJTIwY2hhJTIwZ3JpbGxlZCUyMHBvcmt8ZW58MXx8fHwxNzcyNDEyODMwfDA&ixlib=rb-4.1.0&q=80&w=400",
    prepTime: "40 phút",
    cookTime: "20 phút",
    servings: "4 người",
    difficulty: "Trung bình",
    calories: "520 kcal",
    cuisine: "Việt Nam",
    ingredients: [
      "500g thịt ba chỉ",
      "300g thịt nạc vai",
      "500g bún tươi",
      "Tỏi, hành tím",
      "Nước mắm, đường",
      "Rau thơm, rau sống",
      "Dưa chuột, đu đủ ngâm chua",
      "Ớt, chanh"
    ],
    instructions: [
      "Thịt rửa sạch, thái miếng vừa ăn",
      "Ướp thịt với tỏi, hành băm, nước mắm, đường, tiêu trong 30 phút",
      "Nướng thịt trên than hồng đến chín vàng đều",
      "Làm nước mắm chua ngọt: trộn nước mắm, đường, giấm, nước, tỏi ớt",
      "Cho thêm đu đủ, cà rốt ngâm chua vào nước mắm",
      "Bún chần qua nước sôi",
      "Bày bún, rau sống, múc nước mắm, cho thịt nướng lên trên"
    ],
    tips: "Nướng thịt trên than hồng cho thịt thơm và không bị cháy"
  },
  {
    id: "4",
    name: "Pad Thai",
    description: "Món mì xào Thái Lan nổi tiếng với hương vị chua ngọt hài hòa và đậm đà",
    image: "https://images.unsplash.com/photo-1637806930600-37fa8892069d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWQlMjB0aGFpJTIwbm9vZGxlcyUyMHRoYWl8ZW58MXx8fHwxNzcyNDQxOTExfDA&ixlib=rb-4.1.0&q=80&w=400",
    prepTime: "25 phút",
    cookTime: "15 phút",
    servings: "2 người",
    difficulty: "Dễ",
    calories: "480 kcal",
    cuisine: "Thái Lan",
    ingredients: [
      "200g bánh phở khô",
      "200g tôm",
      "2 quả trứng",
      "Đậu hũ 100g",
      "Giá đỗ 100g",
      "Đậu phộng rang",
      "Hẹ Tàu",
      "Nước mắm, nước cốt me, đường"
    ],
    instructions: [
      "Ngâm bánh phở trong nước ấm 30 phút",
      "Tôm lột vỏ, đậu hũ thái hạt lựu",
      "Làm sốt Pad Thai: trộn nước mắm, me, đường",
      "Đun nóng chảo, phi tỏi thơm",
      "Xào tôm và đậu hũ đến chín",
      "Đẩy sang một bên, đập trứng vào xào",
      "Cho bánh phở, sốt vào xào đều",
      "Thêm giá đỗ, hẹ, đậu phộng rang, trộn đều"
    ],
    tips: "Đừng ngâm bánh phở quá lâu để tránh bị nhão khi xào"
  },
  {
    id: "5",
    name: "Bò lúc lắc",
    description: "Thịt bò thái hạt lựu xào nhanh giữ được độ mềm, ăn kèm salad rau tươi",
    image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwY3ViZXMlMjBzdGFrZXxlbnwxfHx8fDE3NzI0NDE5MTF8MA&ixlib=rb-4.1.0&q=80&w=400",
    prepTime: "20 phút",
    cookTime: "10 phút",
    servings: "2 người",
    difficulty: "Dễ",
    calories: "420 kcal",
    cuisine: "Việt Nam",
    ingredients: [
      "400g thịt bò thăn",
      "Tỏi 4 tép",
      "Hành tây 1 củ",
      "Dầu ăn, bơ",
      "Dưa chuột, cà chua",
      "Xà lách",
      "Tiêu đen, nước tương",
      "Đường, dầu hào"
    ],
    instructions: [
      "Thịt bò rửa sạch, thấm khô, thái hạt lựu",
      "Ướp thịt với tỏi băm, tiêu, nước tương, dầu hào 15 phút",
      "Hành tây cắt múi cau",
      "Đun nóng chảo với dầu và bơ",
      "Cho thịt bò vào xào nhanh lửa lớn 2-3 phút",
      "Thêm hành tây, xào thêm 1 phút",
      "Bày rau sống ra đĩa, xếp thịt bò lên trên",
      "Rắc thêm tiêu đen và ăn nóng"
    ],
    tips: "Xào thịt bò trên lửa lớn và nhanh tay để giữ độ mềm, tránh dai"
  }
];

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem("mealyummy-favorites");
    if (saved) {
      return JSON.parse(saved);
    }
    // Initialize with demo recipes if no saved data
    return initialDemoRecipes;
  });

  useEffect(() => {
    localStorage.setItem("mealyummy-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (recipe: Recipe) => {
    setFavorites((prev) => {
      if (prev.find((r) => r.id === recipe.id)) {
        return prev;
      }
      return [...prev, recipe];
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((recipe) => recipe.id !== id));
  };

  const isFavorite = (id: string) => {
    return favorites.some((recipe) => recipe.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
}
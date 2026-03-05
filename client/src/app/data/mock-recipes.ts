import { type Recipe } from "../contexts/favorites-context";

export const mockRecipes: Recipe[] = [
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
      "Phi thom tỏi băm, cho gạo vào xào",
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
  },
  {
    id: "6",
    name: "Lẩu Thái",
    description: "Món lẩu chua cay đặc trưng với nước dùng từ sả, me, tôm, rau củ và hải sản tươi ngon",
    image: "https://images.unsplash.com/photo-1604908815922-e036242049dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwaG90JTIwcG90JTIwc291cHxlbnwxfHx8fDE3NzI0NDE5MTF8MA&ixlib=rb-4.1.0&q=80&w=400",
    prepTime: "30 phút",
    cookTime: "25 phút",
    servings: "4 người",
    difficulty: "Trung bình",
    calories: "380 kcal",
    cuisine: "Thái Lan",
    ingredients: [
      "Tôm, mực, cá 500g",
      "Nấm các loại 200g",
      "Rau muống, rau cải",
      "Sả 3 cây",
      "Me, ớt, tỏi",
      "Nước mắm, đường",
      "Lá chanh, ngò rí",
      "Nước dùng gà 1 lít"
    ],
    instructions: [
      "Làm nước lẩu: đun sôi nước dùng gà",
      "Cho sả đập dập, lá chanh, ớt vào",
      "Nêm nước cốt me, nước mắm, đường cho vừa ăn chua cay",
      "Chuẩn bị hải sản và rau sống",
      "Đun sôi nước lẩu",
      "Cho từng loại nguyên liệu vào nấu chín",
      "Ăn nóng với bún hoặc mì"
    ],
    tips: "Đun sôi nước lẩu trước khi cho nguyên liệu để giữ được vị ngọt của hải sản"
  },
  {
    id: "7",
    name: "Cà ri gà",
    description: "Món cà ri Ấn Độ đậm đà với nước sốt kem dừa béo ngậy và gia vị thơm nồng",
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwY3VycnklMjBpbmRpYW58ZW58MXx8fHwxNzcyNDQxOTExfDA&ixlib=rb-4.1.0&q=80&w=400",
    prepTime: "20 phút",
    cookTime: "40 phút",
    servings: "4 người",
    difficulty: "Trung bình",
    calories: "480 kcal",
    cuisine: "Ấn Độ",
    ingredients: [
      "600g thịt gà",
      "2 củ khoai tây",
      "1 củ hành tây",
      "400ml nước cốt dừa",
      "Bột cà ri 3 muỗng",
      "Tỏi, gừng",
      "Cà rốt",
      "Nước dùng gà"
    ],
    instructions: [
      "Thịt gà rửa sạch, thái miếng vừa",
      "Khoai tây, cà rốt gọt vỏ, thái miếng",
      "Phi thơm hành tây, tỏi, gừng băm",
      "Cho bột cà ri vào xào thơm",
      "Thêm thịt gà xào săn",
      "Đổ nước cốt dừa và nước dùng",
      "Cho khoai tây, cà rốt vào ninh 30 phút",
      "Nêm nếm, ăn kèm cơm hoặc bánh mì"
    ],
    tips: "Xào bột cà ri với dầu trước khi thêm nước để gia vị thơm và đậm đà hơn"
  },
  {
    id: "8",
    name: "Mì Ý sốt bò bằm",
    description: "Món mì Ý cổ điển Bolognese với sốt thịt bò bằm đậm đà và phô mai Parmesan",
    image: "https://images.unsplash.com/photo-1626190407495-34c9c6c5d66c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFnaGV0dGklMjBib2xvZ25lc2UlMjBpdGFsaWFufGVufDF8fHx8MTc3MjQ0MTkxMXww&ixlib=rb-4.1.0&q=80&w=400",
    prepTime: "15 phút",
    cookTime: "45 phút",
    servings: "3 người",
    difficulty: "Dễ",
    calories: "580 kcal",
    cuisine: "Ý",
    ingredients: [
      "300g mì Ý spaghetti",
      "400g thịt bò bằm",
      "400g cà chua xay",
      "1 củ hành tây",
      "Tỏi 3 tép",
      "Rượu vang đỏ 100ml",
      "Phô mai Parmesan",
      "Húng quế tươi"
    ],
    instructions: [
      "Phi thơm hành tây và tỏi băm",
      "Cho thịt bò bằm vào xào săn",
      "Đổ rượu vang, đun sôi cho bay hơi rượu",
      "Thêm cà chua xay, nước dùng",
      "Ninh nhỏ lửa 30 phút, nêm nếm",
      "Luộc mì Ý theo hướng dẫn trên bao bì",
      "Trộn mì với sốt",
      "Rắc phô mai và húng quế lên trên"
    ],
    tips: "Ninh sốt lâu trên lửa nhỏ để vị ngấm đều và đậm đà hơn"
  },
  {
    id: "9",
    name: "Bánh xèo",
    description: "Món bánh dân dã miền Nam với vỏ bánh giòn rụm, nhân tôm thịt và giá đỗ",
    image: "https://images.unsplash.com/photo-1626776876729-bab4b65b6b7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYmFuaCUyMHhlbyUyMHBhbmNha2V8ZW58MXx8fHwxNzcyNDQxOTExfDA&ixlib=rb-4.1.0&q=80&w=400",
    prepTime: "30 phút",
    cookTime: "30 phút",
    servings: "4 người",
    difficulty: "Trung bình",
    calories: "350 kcal",
    cuisine: "Việt Nam",
    ingredients: [
      "200g bột bánh xèo",
      "300ml nước cốt dừa",
      "Tôm 200g",
      "Thịt ba chỉ 200g",
      "Giá đỗ 200g",
      "Hành lá",
      "Rau sống, rau thơm",
      "Nước mắm chua ngọt"
    ],
    instructions: [
      "Trộn bột bánh xèo với nước cốt dừa và nước lọc",
      "Để bột nghỉ 30 phút",
      "Thái thịt mỏng, tôm lột vỏ",
      "Đun nóng chảo, thêm dầu",
      "Phi thơm hành, cho tôm thịt vào xào",
      "Chan bột mỏng, đậy nắp cho bánh chín",
      "Thêm giá đỗ, hành lá",
      "Gấp đôi bánh, ăn kèm rau sống và nước mắm"
    ],
    tips: "Chảo phải nóng và chan bột mỏng đều để bánh giòn"
  },
  {
    id: "10",
    name: "Gỏi cuốn",
    description: "Món ăn nhẹ thanh mát với bánh tráng cuốn tôm thịt, bún và rau sống",
    image: "https://images.unsplash.com/photo-1599912027572-7c99c39cf43d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwc3ByaW5nJTIwcm9sbHMlMjBmcmVzaHxlbnwxfHx8fDE3NzI0NDE5MTF8MA&ixlib=rb-4.1.0&q=80&w=400",
    prepTime: "35 phút",
    cookTime: "15 phút",
    servings: "4 người",
    difficulty: "Dễ",
    calories: "180 kcal",
    cuisine: "Việt Nam",
    ingredients: [
      "20 tờ bánh tráng",
      "300g tôm",
      "200g thịt ba chỉ",
      "200g bún tươi",
      "Rau sống: xà lách, húng, rau thơm",
      "Nước chấm: tương đen, đậu phộng",
      "Dưa chuột, cà rốt"
    ],
    instructions: [
      "Luộc tôm, thịt chín, để nguội",
      "Tôm bổ đôi, thịt thái mỏng",
      "Rau rửa sạch, để ráo",
      "Làm nước chấm từ tương đen, đậu phộng rang giã nhỏ",
      "Nhúng bánh tráng qua nước ấm",
      "Đặt lên thớt, xếp rau, bún, tôm, thịt",
      "Cuộn chặt, cắt đôi",
      "Chấm với nước tương đậu phộng"
    ],
    tips: "Nhúng bánh tráng nhanh, không ngâm lâu để tránh bánh bị rách"
  }
];

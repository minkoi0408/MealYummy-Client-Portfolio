import { type Recipe } from "../contexts/favorites-context";

export const mockRecipes: Recipe[] = [
  {
    id: "1", name: "Ức gà áp chảo rau củ",
    description: "Ức gà áp chảo giữ được độ ẩm, ăn kèm rau củ hấp — bộ đôi hoàn hảo cho người tập gym tăng cơ.",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "10 phút", cookTime: "20 phút", servings: "1 người", difficulty: "Dễ",
    calories: "380 kcal", cuisine: "Việt Nam",
    ingredients: ["200g ức gà phi lê", "1 muỗng dầu olive", "Ớt chuông đỏ, xanh, vàng", "Bông cải xanh 150g", "Muối, tiêu, tỏi bột", "Nước cốt chanh"],
    instructions: ["Ức gà thấm khô, khía nhẹ 2 mặt", "Ướp muối, tiêu, tỏi bột, nước cốt chanh 10 phút", "Áp chảo lửa vừa 4-5 phút mỗi mặt đến chín vàng", "Hấp bông cải và ớt chuông 5 phút", "Bày ra đĩa, ăn ngay"],
    tips: "Không dùng nắp khi áp chảo để da gà giòn hơn."
  },
  {
    id: "2", name: "Cơm gạo lứt gà nướng mật ong",
    description: "Cơm gạo lứt giàu chất xơ kết hợp gà nướng mật ong thơm — bữa ăn clean eating cân đối macro.",
    image: "https://images.unsplash.com/photo-1604908177453-7462950a6a3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "15 phút", cookTime: "30 phút", servings: "2 người", difficulty: "Dễ",
    calories: "520 kcal", cuisine: "Việt Nam",
    ingredients: ["300g ức gà", "2 muỗng mật ong", "1 muỗng nước tương", "Tỏi 3 tép", "200g gạo lứt", "Rau cải luộc", "Dầu olive, tiêu"],
    instructions: ["Ngâm gạo lứt 1 tiếng, nấu cơm", "Ướp gà với mật ong, nước tương, tỏi bằm", "Nướng gà 200°C 25 phút đến vàng", "Luộc rau cải", "Bày cơm, gà, rau ra đĩa"],
    tips: "Gạo lứt cần ngâm trước để mềm hơn khi nấu."
  },
  {
    id: "3", name: "Salad cá ngừ trứng luộc",
    description: "Salad giàu protein từ cá ngừ và trứng, ít carbonhydrate — lý tưởng cho bữa trưa giảm mỡ.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "10 phút", cookTime: "10 phút", servings: "1 người", difficulty: "Dễ",
    calories: "290 kcal", cuisine: "Quốc tế",
    ingredients: ["1 hộp cá ngừ đóng hộp", "2 quả trứng luộc", "Xà lách romaine", "Cà chua bi", "Dưa chuột", "2 muỗng dầu olive", "Chanh, muối, tiêu"],
    instructions: ["Luộc trứng 9 phút, vớt ra ngâm nước lạnh bóc vỏ", "Rửa và xé nhỏ xà lách", "Thái dưa chuột, cắt đôi cà chua bi", "Trộn dầu olive với nước cốt chanh, muối tiêu", "Xếp tất cả ra đĩa, rưới sốt", "Đặt cá ngừ và trứng lên trên"],
    tips: "Để sốt dầu chanh vào lúc ăn để rau không bị hèo."
  },
  {
    id: "4", name: "Phở gà ít béo",
    description: "Phở gà truyền thống với nước dùng trong, ít béo hơn phở bò — phù hợp người ăn sạch sau tập.",
    image: "https://images.unsplash.com/photo-1605244854892-778e2c2c0c5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "20 phút", cookTime: "2 giờ", servings: "4 người", difficulty: "Trung bình",
    calories: "380 kcal", cuisine: "Việt Nam",
    ingredients: ["1 con gà ta (1kg)", "400g bánh phở", "Hành tây 1 củ", "Gừng 50g", "Hồi 3 cái", "Quế 1 thanh", "Hành lá, ngò gai", "Nước mắm, muối"],
    instructions: ["Chần gà qua nước sôi loại tạp chất", "Nướng hành gừng cho thơm", "Ninh gà với gia vị 90 phút lửa nhỏ", "Vớt gà, lọc lấy nước trong", "Nêm nếm vừa ăn", "Luộc bánh phở", "Bày tô, chan nước dùng nóng, thêm gà xé"],
    tips: "Hớt bọt thường xuyên khi ninh để nước trong hơn."
  },
  {
    id: "5", name: "Bò lúc lắc quinoa",
    description: "Thịt bò thăn xào nhanh, ăn kèm quinoa thay cơm — bữa ăn tăng cơ giàu protein và amino acid.",
    image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "20 phút", cookTime: "15 phút", servings: "2 người", difficulty: "Dễ",
    calories: "480 kcal", cuisine: "Fusion",
    ingredients: ["350g thịt bò thăn", "150g quinoa", "Ớt chuông 1 quả", "Tỏi 4 tép, bơ 10g", "Nước tương, dầu hào", "Muối, tiêu, dầu olive", "Rau xà lách"],
    instructions: ["Nấu quinoa với nước 2:1 trong 15 phút", "Thịt bò thái hạt lựu, ướp nước tương, tỏi, tiêu", "Đun nóng chảo với dầu và bơ", "Xào thịt bò lửa lớn 3 phút, thêm ớt chuông", "Bày quinoa, rau, thịt bò ra đĩa"],
    tips: "Lửa lớn là bí quyết để thịt bò mềm và không ra nước."
  },
  {
    id: "6", name: "Trứng luộc lòng đào rau bina",
    description: "Bữa sáng giàu protein với trứng lòng đào và rau bina xào tỏi — nạp năng lượng trước buổi tập.",
    image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "5 phút", cookTime: "10 phút", servings: "1 người", difficulty: "Dễ",
    calories: "220 kcal", cuisine: "Quốc tế",
    ingredients: ["2 quả trứng gà", "100g rau bina (spinach)", "2 tép tỏi", "1 muỗng dầu olive", "Muối, tiêu", "Ớt bột paprika"],
    instructions: ["Đun nước sôi, thêm giấm", "Đánh nhẹ trứng vào nước xoáy nhẹ, luộc 3 phút", "Phi tỏi bằm với dầu olive", "Cho rau bina vào xào 2 phút, nêm muối tiêu", "Bày rau ra đĩa, đặt trứng lên trên, rắc paprika"],
    tips: "Thêm giấm vào nước luộc giúp lòng trắng đông tròn hơn."
  },
  {
    id: "7", name: "Cháo yến mạch chuối protein",
    description: "Cháo yến mạch nấu sữa bổ sung chuối và whey protein — bữa sáng hoàn hảo để tăng cơ sau tập.",
    image: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "2 phút", cookTime: "5 phút", servings: "1 người", difficulty: "Dễ",
    calories: "420 kcal", cuisine: "Quốc tế",
    ingredients: ["80g yến mạch cán mỏng", "250ml sữa hạnh nhân", "1 quả chuối", "1 muỗng bơ đậu phộng", "Mật ong", "Hạt chia, hạt óc chó"],
    instructions: ["Đun sữa hạnh nhân đến ấm", "Cho yến mạch vào khuấy đều", "Nấu lửa vừa 5 phút khuấy liên tục", "Đổ ra tô, thêm chuối thái, bơ đậu phộng", "Rắc hạt chia, óc chó và mật ong"],
    tips: "Dùng yến mạch cán mỏng (rolled oats) cho kết cấu mịn, không bị bột."
  },
  {
    id: "8", name: "Cá hồi nướng chanh dill",
    description: "Cá hồi nướng giàu omega-3 và protein, ướp chanh dill thơm — bữa ăn phục hồi cơ bắp tuyệt vời.",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "10 phút", cookTime: "15 phút", servings: "2 người", difficulty: "Dễ",
    calories: "390 kcal", cuisine: "Quốc tế",
    ingredients: ["2 miếng cá hồi (200g mỗi miếng)", "2 muỗng dầu olive", "1 quả chanh", "Rau dill tươi", "Tỏi 3 tép", "Măng tây 200g", "Muối, tiêu"],
    instructions: ["Cá hồi thấm khô, ướp muối tiêu tỏi bằm", "Rưới dầu olive và nước chanh lên cá", "Nướng 200°C trong 12-15 phút", "Chần măng tây qua nước sôi 3 phút", "Bày ra đĩa, thêm rau dill tươi và chanh"],
    tips: "Đừng nướng quá chín — cá hồi tại nhiệt độ 63°C ở giữa là hoàn hảo."
  },
  {
    id: "9", name: "Gỏi cuốn tôm rau thơm",
    description: "Gỏi cuốn thanh đạm, ít calo nhưng đủ protein từ tôm — snack sau tập lý tưởng.",
    image: "https://images.unsplash.com/photo-1599912027572-7c99c39cf43d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "25 phút", cookTime: "10 phút", servings: "2 người", difficulty: "Dễ",
    calories: "200 kcal", cuisine: "Việt Nam",
    ingredients: ["12 tờ bánh tráng", "300g tôm luộc", "Bún tươi 100g", "Xà lách, húng quế, rau diếp cá", "Cà rốt, dưa chuột", "Tương đen, đậu phộng rang giã nhỏ"],
    instructions: ["Tôm luộc, bóc vỏ, bổ đôi", "Rau rửa sạch để ráo nước", "Cà rốt dưa chuột thái sợi", "Nhúng bánh tráng vào nước ấm", "Cuộn thứ tự: rau, bún, tôm, cà rốt", "Chấm tương đen pha đậu phộng"],
    tips: "Nhúng bánh tráng qua nước nhanh — đừng ngâm để tránh rách."
  },
  {
    id: "10", name: "Súp đậu hũ rau củ",
    description: "Súp thanh nhẹ giàu thực vật protein từ đậu hũ và rau củ xanh — bữa ăn phục hồi sau ngày tập nặng.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "15 phút", cookTime: "20 phút", servings: "2 người", difficulty: "Dễ",
    calories: "180 kcal", cuisine: "Việt Nam",
    ingredients: ["300g đậu hũ non", "Nấm hương 100g", "Cà rốt 1 củ", "Bông cải xanh 150g", "Hành tím, tỏi", "Nước dùng rau củ 500ml", "Nước tương, tiêu", "Hành lá, ngò rí"],
    instructions: ["Đổ nước dùng vào nồi đun sôi", "Phi hành tỏi, đổ nước dùng vào", "Thêm cà rốt thái mỏng nấu 5 phút", "Thêm nấm, bông cải, đậu hũ", "Nêm nước tương, tiêu", "Chan ra tô, thêm hành ngò"],
    tips: "Đậu hũ non dễ vỡ, cho vào sau cùng và đừng khuấy mạnh."
  },
  {
    id: "11", name: "Bún bò Huế ít béo",
    description: "Bún bò Huế truyền thống được điều chỉnh ít chất béo hơn — giữ nguyên vị cay nồng đặc trưng.",
    image: "https://images.unsplash.com/photo-1676037150408-4b42c3b03248?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "30 phút", cookTime: "2 giờ", servings: "4 người", difficulty: "Khó",
    calories: "420 kcal", cuisine: "Việt Nam",
    ingredients: ["500g bắp bò", "300g giò heo", "500g bún bò", "Sả 3 cây, ớt", "Mắm ruốc", "Hành tím, tỏi", "Rau sống: chuối bắp, hoa chuối", "Ruốc, muối, đường"],
    instructions: ["Ninh xương và thịt bò 2 tiếng", "Phi sả, ớt, ruốc cho thơm", "Cho vào nồi nước dùng, nêm nếm", "Luộc chín bún bò", "Thái thịt bò mỏng", "Chan nước dùng nóng, ăn kèm rau sống"],
    tips: "Mắm ruốc là linh hồn của bún bò, đừng bỏ qua."
  },
  {
    id: "12", name: "Tôm chiên sốt me",
    description: "Tôm chiên giòn sốt me chua ngọt — cao protein, vị đậm, phù hợp bữa ăn sau resistance training.",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "15 phút", cookTime: "15 phút", servings: "2 người", difficulty: "Dễ",
    calories: "320 kcal", cuisine: "Việt Nam",
    ingredients: ["400g tôm sú", "2 muỗng me chua", "1.5 muỗng đường", "Tỏi, ớt", "Bột chiên xù (ít)", "Dầu ăn", "Hành lá, ngò"],
    instructions: ["Tôm lột vỏ, để nguyên đuôi", "Lăn qua lớp bột chiên mỏng", "Chiên ngập dầu đến vàng giòn, để thấm giấy", "Nấu sốt: me pha nước + đường + tỏi ớt", "Đảo tôm qua sốt nhanh tay", "Trang trí hành lá, ngò"],
    tips: "Đừng chiên tôm quá lâu — tôm chín rất nhanh."
  },
  {
    id: "13", name: "Đậu phụ sốt gừng miso",
    description: "Đậu phụ chắc nướng với sốt miso gừng umami — nguồn thực vật protein tuyệt vời cho người ăn chay tập gym.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "10 phút", cookTime: "20 phút", servings: "2 người", difficulty: "Dễ",
    calories: "260 kcal", cuisine: "Nhật Bản",
    ingredients: ["400g đậu phụ chắc", "2 muỗng miso trắng", "1 muỗng mật ong", "Gừng tươi 20g", "Nước tương", "Vừng trắng", "Hành lá", "Bông cải xanh hấp"],
    instructions: ["Đậu phụ thấm khô, cắt miếng dày 2cm", "Pha sốt: miso, mật ong, gừng bào, nước tương", "Phết sốt lên đậu phụ", "Nướng 200°C 15 phút lật giữa chừng", "Rắc vừng, hành lá", "Ăn kèm bông cải hấp"],
    tips: "Thấm khô đậu phụ kỹ để sốt bám tốt hơn."
  },
  {
    id: "14", name: "Cơm chiên trứng rau xanh",
    description: "Cơm chiên đơn giản với trứng và nhiều rau — bữa ăn nhanh giàu dinh dưỡng sau buổi tập buổi tối.",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "10 phút", cookTime: "10 phút", servings: "1 người", difficulty: "Dễ",
    calories: "440 kcal", cuisine: "Việt Nam",
    ingredients: ["200g cơm nguội", "2 quả trứng", "Đậu que 100g", "Ngô hạt", "Cà rốt bào sợi", "Tỏi 2 tép", "Nước tương, tiêu", "Dầu mè (tùy chọn)"],
    instructions: ["Phi tỏi thơm với ít dầu", "Trứng đánh tan, đổ vào xào chín tơi", "Thêm rau củ đảo nhanh", "Cho cơm nguội vào đảo mạnh tay", "Nêm nước tương, tiêu", "Rưới dầu mè, tắt bếp"],
    tips: "Cơm lạnh từ tủ lạnh sẽ tơi hơn khi xào."
  },
  {
    id: "15", name: "Gà hấp sả lá chanh",
    description: "Gà hấp nguyên con với sả và lá chanh — không dầu mỡ, giữ nguyên vị ngọt tự nhiên của thịt gà.",
    image: "https://images.unsplash.com/photo-1598515213692-b5cb3a4f1f19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "15 phút", cookTime: "40 phút", servings: "3 người", difficulty: "Dễ",
    calories: "310 kcal", cuisine: "Việt Nam",
    ingredients: ["1 con gà ta 1.2kg", "Sả 4 cây đập dập", "Lá chanh 10 lá", "Gừng 50g thái lát", "Muối, tiêu", "Nước mắm chanh tỏi ớt"],
    instructions: ["Rửa sạch gà, ướp muối tiêu bên trong", "Nhồi sả, lá chanh, gừng vào bụng gà", "Xếp phần còn lại xuống nồi hấp", "Hấp 40 phút lửa lớn", "Để nguội chặt miếng", "Ăn kèm nước mắm chanh ớt"],
    tips: "Hấp thay vì luộc giúp da gà vẫn vàng và ngon hơn."
  },
  {
    id: "16", name: "Canh chua cá lóc bông cải",
    description: "Canh chua thanh mát với cá lóc tươi và bông cải — bổ sung vitamin C và protein sau tập luyện.",
    image: "https://images.unsplash.com/photo-1555126634-323283e090fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "20 phút", cookTime: "20 phút", servings: "3 người", difficulty: "Dễ",
    calories: "220 kcal", cuisine: "Việt Nam",
    ingredients: ["500g cá lóc", "Cà chua 2 quả", "Dứa (thơm) 1/4 quả", "Me chua 50g", "Bạc hà, ngò gai, giá đỗ", "Ớt, tỏi", "Nước mắm, đường", "Bông cải xanh 150g"],
    instructions: ["Cá lóc làm sạch, cắt khúc", "Nấu nước me với cà chua dứa", "Nêm nước mắm, đường, muối", "Cho cá vào nấu 10 phút", "Thêm bông cải, giá đỗ", "Tắt bếp thêm rau thơm"],
    tips: "Nấu cá vừa chín tới để thịt không bị khô."
  },
  {
    id: "17", name: "Thịt bò xào bông cải xanh",
    description: "Thịt bò thăn xào cùng bông cải xanh — kết hợp protein động vật và chất chống oxy hóa từ rau.",
    image: "https://images.unsplash.com/photo-1555126634-323283e090fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "15 phút", cookTime: "10 phút", servings: "2 người", difficulty: "Dễ",
    calories: "350 kcal", cuisine: "Á châu",
    ingredients: ["300g thịt bò thăn, thái lát", "300g bông cải xanh", "Tỏi 4 tép", "Gừng 15g", "2 muỗng nước tương", "1 muỗng dầu hào", "Dầu mè, tiêu"],
    instructions: ["Chần bông cải qua nước sôi 2 phút", "Thịt bò ướp nước tương, tiêu", "Phi tỏi gừng thơm với dầu", "Xào thịt bò lửa lớn 2 phút", "Thêm bông cải, đảo đều", "Nêm dầu hào, dầu mè, tắt bếp"],
    tips: "Chần bông cải trước để rau xanh đẹp và không mất vitamin."
  },
  {
    id: "18", name: "Smoothie protein xoài chuối",
    description: "Smoothie bổ sung protein sau tập — xoài ngọt, chuối dẻo, whey protein và sữa hạnh nhân.",
    image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "5 phút", cookTime: "0 phút", servings: "1 người", difficulty: "Dễ",
    calories: "350 kcal", cuisine: "Quốc tế",
    ingredients: ["1 quả xoài chín", "1 quả chuối đông lạnh", "200ml sữa hạnh nhân", "1 scoop whey protein vani", "1 muỗng hạt chia", "Đá viên"],
    instructions: ["Bỏ tất cả nguyên liệu vào máy xay", "Xay 60 giây đến nhuyễn mịn", "Kiểm tra độ đặc, thêm sữa nếu cần", "Đổ ra ly, thêm hạt chia lên trên"],
    tips: "Dùng chuối đông lạnh thay đá để smoothie đặc và ngậy hơn."
  },
  {
    id: "19", name: "Cá thu sốt cà chua cay",
    description: "Cá thu kho cà chua cay nhẹ — cá béo nhiều omega-3, vị đậm đà, ăn với cơm gạo lứt rất ngon.",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "10 phút", cookTime: "25 phút", servings: "2 người", difficulty: "Dễ",
    calories: "340 kcal", cuisine: "Việt Nam",
    ingredients: ["400g cá thu cắt khúc", "2 quả cà chua", "Tỏi, ớt, sả", "Nước mắm, đường, tiêu", "Hành lá, ngò"],
    instructions: ["Phi tỏi sả ớt thơm", "Cho cà chua vào xào mềm", "Thêm cá vào, nêm nước mắm đường", "Kho lửa vừa 20 phút", "Thêm hành lá, ngò tắt bếp"],
    tips: "Kho đậy nắp nửa chừng để nước không quá cạn."
  },
  {
    id: "20", name: "Salad gà nướng avocado",
    description: "Salad thăng bằng macro hoàn hảo — gà nướng protein, avocado chất béo tốt, rau xanh vitamin.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "15 phút", cookTime: "20 phút", servings: "2 người", difficulty: "Dễ",
    calories: "420 kcal", cuisine: "Quốc tế",
    ingredients: ["300g ức gà", "1 quả avocado", "Rau rocket / rau bina", "Cà chua bi", "Hạt dẻ cười hoặc hạt thông", "Dầu olive, giấm balsamic", "Muối, tiêu, tỏi bột"],
    instructions: ["Ức gà ướp tỏi muối tiêu, nướng 200°C 20 phút", "Để nguội thái lát mỏng", "Avocado thái lát, cắt đôi cà chua bi", "Xếp rau, gà, avocado ra tô", "Rưới dầu olive + giấm balsamic", "Rắc hạt lên trên"],
    tips: "Dùng giấm balsamic loại già (aged) để vị ngọt hơn."
  },
  {
    id: "21", name: "Bánh mì trứng ốp la rau củ",
    description: "Bánh mì lứa mì nguyên cám với trứng ốp la và rau củ — bữa sáng giàu năng lượng cho người tập buổi sáng.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "5 phút", cookTime: "10 phút", servings: "1 người", difficulty: "Dễ",
    calories: "380 kcal", cuisine: "Việt Nam",
    ingredients: ["1 ổ bánh mì nguyên cám", "2 quả trứng", "Cà chua, dưa chuột", "Xà lách", "Ớt chuông", "Dầu olive", "Muối, tiêu"],
    instructions: ["Nướng bánh mì 180°C 5 phút", "Đặt chảo lên bếp, thêm dầu olive", "Ốp la 2 trứng đến lòng trắng chín", "Cắt bánh mì dọc, xếp rau vào", "Đặt trứng lên rau", "Nêm muối tiêu"],
    tips: "Nướng bánh mì giòn trước khi xếp nhân để không bị ỉu."
  },
  {
    id: "22", name: "Cơm tấm sườn nướng ít dầu",
    description: "Cơm tấm sườn nướng đặc sản Sài Gòn, phiên bản ít dầu mỡ — vẫn đủ vị đậm đà cho người tập luyện.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "30 phút", cookTime: "20 phút", servings: "2 người", difficulty: "Trung bình",
    calories: "560 kcal", cuisine: "Việt Nam",
    ingredients: ["400g sườn non", "300g gạo tấm", "Ướp: sả, tỏi, mật ong, nước tương, muối tiêu", "Bì heo (tùy chọn)", "Dưa leo, cà chua", "Nước mắm chua ngọt"],
    instructions: ["Sườn ướp gia vị tối thiểu 1 tiếng", "Nướng sườn 200°C 20 phút lật giữa", "Nấu cơm tấm như cơm thường", "Bày cơm, sườn, rau ra đĩa", "Rưới nước mắm chua ngọt"],
    tips: "Phết mật ong lên sườn trước 5 phút nướng để bóng và thơm."
  },
  {
    id: "23", name: "Canh rau ngót thịt bằm",
    description: "Canh rau ngót thuần Việt với thịt bằm — đơn giản, ít calo, giàu sắt và vitamin từ rau ngót.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "10 phút", cookTime: "15 phút", servings: "3 người", difficulty: "Dễ",
    calories: "150 kcal", cuisine: "Việt Nam",
    ingredients: ["200g thịt heo bằm", "Rau ngót 200g", "Tỏi 2 tép", "Nước mắm, muối", "Hành lá"],
    instructions: ["Phi tỏi thơm, xào thịt bằm chín", "Đổ nước vào đun sôi", "Cho rau ngót vào nấu 5 phút", "Nêm nước mắm, muối vừa ăn", "Thêm hành lá tắt bếp"],
    tips: "Rau ngót nấu quá chín sẽ mất màu xanh và vitamin."
  },
  {
    id: "24", name: "Thịt gà xé phay bắp cải",
    description: "Gà xé trộn bắp cải — salad kiểu Việt ẩm thực chua ngọt, ít calo, giàu protein, không dầu mỡ.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "20 phút", cookTime: "30 phút", servings: "3 người", difficulty: "Dễ",
    calories: "250 kcal", cuisine: "Việt Nam",
    ingredients: ["400g ức gà luộc", "300g bắp cải tím bào", "Cà rốt bào sợi", "Hành tím", "Rau thơm: ngò, húng", "Chanh, tỏi, ớt, đường, nước mắm", "Đậu phộng rang"],
    instructions: ["Luộc gà chín, để nguội xé sợi", "Trộn nước mắm chanh ớt tỏi đường", "Trộn gà với bắp cải cà rốt", "Rưới nước trộn, đảo đều", "Thêm rau thơm, hành phi", "Rắc đậu phộng rang"],
    tips: "Bắp cải tím giúp salad thêm màu sắc và chứa nhiều antioxidant."
  },
  {
    id: "25", name: "Pancake chuối yến mạch",
    description: "Pancake chỉ từ chuối và yến mạch — không bột mì, không đường, bữa sáng sạch cho người tập.",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "5 phút", cookTime: "10 phút", servings: "1 người", difficulty: "Dễ",
    calories: "310 kcal", cuisine: "Quốc tế",
    ingredients: ["2 quả chuối chín", "80g yến mạch xay", "2 quả trứng", "1/2 muỗng cà phê bột quế", "Dầu dừa", "Các loại quả mọng, mật ong"],
    instructions: ["Xay yến mạch thành bột mịn", "Nghiền chuối, trộn với trứng và yến mạch", "Thêm quế, khuấy đều", "Đổ từng muỗng lên chảo dầu dừa đã nóng", "Chiên 2-3 phút mỗi mặt", "Ăn kèm quả mọng và mật ong"],
    tips: "Chuối càng chín ngọt thì pancake sẽ không cần thêm đường."
  },
  {
    id: "26", name: "Tôm hấp bia rau thơm",
    description: "Tôm hấp bia nguyên vỏ giữ ngọt tự nhiên — bổ sung protein tinh khiết không calo thừa.",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "5 phút", cookTime: "10 phút", servings: "2 người", difficulty: "Dễ",
    calories: "200 kcal", cuisine: "Việt Nam",
    ingredients: ["500g tôm sú", "1 lon bia (hoặc nước)", "Sả 2 cây, gừng", "Lá chanh, ớt", "Muối, tiêu", "Nước chấm: muối tiêu chanh"],
    instructions: ["Rửa tôm sạch, khứa lưng loại chỉ đen", "Cho bia, sả, gừng vào nồi đun sôi", "Xếp tôm vào hấp 8 phút", "Làm muối tiêu chanh", "Bày ra đĩa ăn nóng"],
    tips: "Khứa lưng tôm trước khi hấp giúp tôm chín đều và đẹp hơn."
  },
  {
    id: "27", name: "Mì soba rong biển trứng luộc",
    description: "Mì soba Nhật ít calo, giàu chất xơ, ăn lạnh kèm rong biển và trứng — bữa ăn nhẹ sau tập.",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "10 phút", cookTime: "5 phút", servings: "1 người", difficulty: "Dễ",
    calories: "310 kcal", cuisine: "Nhật Bản",
    ingredients: ["100g mì soba", "2 quả trứng luộc", "Rong biển wakame", "Hành lá, vừng trắng", "Nước dùng: nước tương, mirin, dashi", "Đá lạnh"],
    instructions: ["Luộc mì soba 5 phút, xả nước lạnh", "Luộc trứng lòng đào 7 phút", "Pha nước chấm từ nước tương, mirin, dashi", "Xếp mì vào tô với đá", "Bày rong biển, trứng lên trên", "Rưới nước dùng, rắc vừng hành"],
    tips: "Xả nước lạnh ngay sau khi luộc mì để mì dai và không bị dính."
  },
  {
    id: "28", name: "Gà xông khói salad Caesar ít béo",
    description: "Caesar salad phiên bản nhẹ — thay bacon bằng gà nướng, sốt ít mayo, phù hợp chế độ cutting.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "15 phút", cookTime: "20 phút", servings: "2 người", difficulty: "Dễ",
    calories: "320 kcal", cuisine: "Quốc tế",
    ingredients: ["300g ức gà nướng", "Xà lách romaine", "Phô mai Parmesan bào", "Bánh mì nguyên cám cắt hạt lựu nướng giòn", "Sốt Caesar ít béo: sữa chua Hy Lạp, chanh, tỏi, nước tương, tiêu"],
    instructions: ["Nướng gà 200°C 20 phút, thái lát", "Nướng bánh mì hạt lựu đến giòn", "Pha sốt Caesar từ sữa chua, chanh, tỏi, nước tương", "Xé xà lách, trộn với sốt", "Bày gà, bánh mì, Parmesan lên trên"],
    tips: "Dùng sữa chua Hy Lạp thay mayo giảm 60% chất béo mà vẫn béo ngậy."
  },
  {
    id: "29", name: "Cá basa hấp tương đậu đen",
    description: "Cá basa hấp tương đậu đen kiểu Hồng Kông — ít dầu, nhiều protein, vị umami đậm đà.",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "10 phút", cookTime: "15 phút", servings: "2 người", difficulty: "Dễ",
    calories: "270 kcal", cuisine: "Á châu",
    ingredients: ["400g cá basa phi lê", "2 muỗng tương đậu đen", "Gừng thái sợi", "Hành lá", "Dầu mè 1 muỗng", "Nước tương, đường", "Ớt đỏ thái sợi"],
    instructions: ["Cá rửa sạch, thấm khô", "Trộn tương đậu đen với nước tương, đường", "Phết sốt lên mặt cá", "Hấp cá 12-15 phút", "Đun sôi dầu mè, rưới lên cá", "Trang trí gừng, hành, ớt"],
    tips: "Rưới dầu sôi lên cá cuối cùng tạo tiếng xèo hấp dẫn và chín thêm hành gừng."
  },
  {
    id: "30", name: "Bột protein bar tự làm",
    description: "Thanh năng lượng tự làm từ yến mạch, đậu phộng và mật ong — snack trước tập tiện lợi.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "15 phút", cookTime: "20 phút", servings: "8 thanh", difficulty: "Dễ",
    calories: "180 kcal", cuisine: "Quốc tế",
    ingredients: ["200g yến mạch", "100g bơ đậu phộng", "60ml mật ong", "1 scoop protein bột vani", "50g hạt các loại", "50g chocolate đen 85%", "1 muỗng dầu dừa"],
    instructions: ["Nướng yến mạch 180°C 10 phút cho thơm", "Trộn bơ đậu phộng, mật ong, dầu dừa đun chảy", "Thêm yến mạch, protein bột, hạt vào trộn", "Đổ vào khuôn, ép chặt", "Nấu chảy chocolate rưới lên trên", "Để ngăn mát 1 tiếng rồi cắt thành thanh"],
    tips: "Bảo quản trong hộp kín ngăn mát được 1 tuần."
  },
  {
    id: "31", name: "Cơm gạo lứt cá hồi teriyaki",
    description: "Cá hồi áp chảo sốt teriyaki ít đường, ăn kèm cơm gạo lứt và rau cải luộc — bữa ăn tăng cơ chuẩn.",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "15 phút", cookTime: "25 phút", servings: "2 người", difficulty: "Trung bình",
    calories: "510 kcal", cuisine: "Nhật Bản",
    ingredients: ["2 miếng cá hồi 180g", "Sốt teriyaki: nước tương, mirin, ít mật ong", "200g gạo lứt", "Bông cải luộc", "Vừng rang", "Hành lá"],
    instructions: ["Nấu cơm gạo lứt", "Pha sốt teriyaki đun sôi đến sệt", "Áp chảo cá hồi mỗi mặt 3 phút", "Phết sốt teriyaki lên cá tiếp tục áp 1 phút", "Luộc bông cải", "Bày cơm, cá, rau, rắc vừng"],
    tips: "Đun sốt kỹ để bay bớt cồn trong mirin, vị sẽ ngọt nhẹ và thơm hơn."
  },
  {
    id: "32", name: "Canh bí đỏ thịt gà",
    description: "Canh bí đỏ ngọt tự nhiên với gà — giàu beta-carotene, ít calo, phục hồi sau tập luyện.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "10 phút", cookTime: "25 phút", servings: "3 người", difficulty: "Dễ",
    calories: "190 kcal", cuisine: "Việt Nam",
    ingredients: ["300g bí đỏ", "200g ức gà bằm", "Hành tím, tỏi", "Nước mắm, muối", "Hành lá, ngò"],
    instructions: ["Gà bằm ướp nước mắm muối tiêu", "Bí đỏ gọt vỏ, cắt miếng", "Phi hành tỏi thơm, xào gà chín", "Thêm nước vào đun sôi", "Cho bí đỏ vào nấu 15 phút mềm", "Nêm nếm, thêm hành ngò"],
    tips: "Dùng bí đỏ chín vàng để canh có độ ngọt tự nhiên tốt nhất."
  },
  {
    id: "33", name: "Thịt heo luộc cuộn rau sống",
    description: "Thịt heo nạc luộc chín cuộn với nhiều loại rau sống — đạm cao, fat thấp, ăn no lâu.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "15 phút", cookTime: "20 phút", servings: "3 người", difficulty: "Dễ",
    calories: "240 kcal", cuisine: "Việt Nam",
    ingredients: ["400g thịt heo nạc", "Xà lách, húng quế, diếp cá", "Dưa chuột, cà rốt bào", "Bún tươi 100g", "Nước chấm: nước mắm chanh ớt tỏi", "Bánh tráng (tùy chọn)"],
    instructions: ["Thịt luộc với gừng, muối đến chín", "Để nguội thái mỏng", "Chuẩn bị rau sống, cà rốt dưa chuột", "Pha nước chấm chua ngọt", "Cuộn thịt với rau sống", "Chấm nước mắm, ăn kèm bún"],
    tips: "Ngâm thịt luộc vào nước đá ngay sau khi chín giúp thịt chắc và dễ thái mỏng."
  },
  {
    id: "34", name: "Đậu đen hầm trứng muối",
    description: "Đậu đen hầm bổ sung chất xơ và protein thực vật — kết hợp trứng muối cho vị mặn đặc biệt.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "20 phút", cookTime: "45 phút", servings: "4 người", difficulty: "Trung bình",
    calories: "280 kcal", cuisine: "Việt Nam",
    ingredients: ["300g đậu đen", "4 quả trứng muối", "Hành tím, tỏi", "Nước tương, đường, muối", "Ngũ vị hương", "Nước dừa tươi 200ml"],
    instructions: ["Ngâm đậu đen 4 tiếng, rửa sạch", "Luộc qua đậu đen 10 phút", "Phi hành tỏi, thêm ngũ vị hương", "Cho đậu, nước dừa vào hầm 30 phút", "Thêm trứng muối, nêm vừa ăn", "Hầm thêm 10 phút đến đậu mềm"],
    tips: "Nước dừa tươi thay nước lọc giúp đậu đen có vị ngọt tự nhiên thơm hơn."
  },
  {
    id: "35", name: "Greek yogurt bowl granola",
    description: "Sữa chua Hy Lạp với granola tự làm và trái cây tươi — bổ sung probiotic và protein cho buổi sáng.",
    image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "5 phút", cookTime: "0 phút", servings: "1 người", difficulty: "Dễ",
    calories: "380 kcal", cuisine: "Quốc tế",
    ingredients: ["200g sữa chua Hy Lạp không đường", "50g granola", "Dâu tây, việt quất", "Chuối thái", "1 muỗng mật ong", "Hạt lanh, hạt chia"],
    instructions: ["Đổ sữa chua vào tô", "Xếp granola lên một bên", "Bày trái cây tươi", "Rưới mật ong", "Rắc hạt lanh, hạt chia", "Ăn ngay"],
    tips: "Chọn sữa chua Hy Lạp nguyên chất để có nhiều protein nhất (15-17g/100ml)."
  },
  {
    id: "36", name: "Cá diêu hồng hấp gừng hành",
    description: "Cá diêu hồng hấp kiểu Hoa — ít dầu, giữ nguyên protein, vị thanh ngọt với gừng hành.",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "15 phút", cookTime: "20 phút", servings: "3 người", difficulty: "Dễ",
    calories: "280 kcal", cuisine: "Á châu",
    ingredients: ["1 con cá diêu hồng 700g", "Gừng 50g thái sợi", "Hành lá 5 cây", "Nước tương 3 muỗng", "Đường 1 muỗng", "Dầu ăn 2 muỗng đun sôi", "Ớt đỏ"],
    instructions: ["Cá làm sạch, khứa 3 đường hai bên", "Nhồi gừng vào bên trong", "Hấp cá 15-18 phút tùy kích cỡ", "Pha nước tương đường", "Xếp hành sợi lên cá", "Rưới nước tương, đổ dầu sôi lên hành"],
    tips: "Khứa đường trên thân cá giúp gia vị ngấm đều và cá nhanh chín."
  },
  {
    id: "37", name: "Bò sốt tiêu xanh",
    description: "Thịt bò thăn xào sốt tiêu xanh thơm nồng — vị đậm đà, giàu protein, phù hợp ngày tập nặng.",
    image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "20 phút", cookTime: "10 phút", servings: "2 người", difficulty: "Trung bình",
    calories: "420 kcal", cuisine: "Việt Nam",
    ingredients: ["350g thịt bò thăn", "1 muỗng tiêu xanh", "Hành tím, tỏi, sả", "Dầu hào, nước tương", "Bơ 10g", "Ớt chuông", "Hành lá, ngò"],
    instructions: ["Thịt bò thái lát, ướp nước tương tiêu", "Phi sả hành tỏi với bơ", "Xào bò lửa lớn đến tái", "Thêm tiêu xanh nghiền nhẹ", "Cho ớt chuông, đảo nhanh", "Nêm dầu hào, tắt bếp"],
    tips: "Nghiền nhẹ tiêu xanh để tinh dầu tiêu tỏa ra, không xay nát."
  },
  {
    id: "38", name: "Súp gà nấm đông cô",
    description: "Súp gà ấm áp với nấm đông cô giàu vitamin D — bổ dưỡng, ít calo, phục hồi sau tập.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "15 phút", cookTime: "30 phút", servings: "3 người", difficulty: "Dễ",
    calories: "200 kcal", cuisine: "Á châu",
    ingredients: ["400g ức gà", "100g nấm đông cô", "Cần tây 2 cây", "Hành tây 1 củ", "Cà rốt 1 củ", "Tỏi 3 tép", "Muối, tiêu, lá bay", "Nước hầm xương 1 lít"],
    instructions: ["Đun nước hầm xương", "Phi hành tây tỏi thơm", "Cho gà cắt hạt lựu vào xào", "Thêm nấm, cà rốt, cần tây", "Đổ nước hầm, thêm lá bay", "Nấu 20 phút, nêm vừa ăn"],
    tips: "Dùng nước hầm xương tự nấu giúp súp đậm vị và giàu collagen hơn."
  },
  {
    id: "39", name: "Rau củ nướng mật ong rosemary",
    description: "Hỗn hợp rau củ nướng với mật ong và rosemary — bổ sung chất xơ và vi khoáng cho người tập gym.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "15 phút", cookTime: "30 phút", servings: "2 người", difficulty: "Dễ",
    calories: "200 kcal", cuisine: "Quốc tế",
    ingredients: ["Khoai lang 1 củ", "Cà rốt 2 củ", "Củ dền 2 củ", "Tỏi 1 đầu", "2 muỗng mật ong", "3 muỗng dầu olive", "Rosemary tươi", "Muối, tiêu"],
    instructions: ["Gọt vỏ, cắt rau củ miếng vừa ăn", "Trộn đều dầu olive, mật ong, muối tiêu", "Tẩm ướp rau củ với hỗn hợp trên", "Xếp ra khay nướng không dính", "Thêm tỏi, rosemary", "Nướng 220°C 30 phút, lật giữa chừng"],
    tips: "Đừng xếp quá dày — rau củ cần không gian để nướng vàng đều."
  },
  {
    id: "40", name: "Bò hầm cà rốt khoai tây ít béo",
    description: "Bò hầm với cà rốt và khoai tây — bữa ăn phục hồi cơ bắp sau buổi tập sức mạnh dài.",
    image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "20 phút", cookTime: "1.5 giờ", servings: "4 người", difficulty: "Trung bình",
    calories: "430 kcal", cuisine: "Việt Nam",
    ingredients: ["600g bò nạm hoặc bắp bò", "3 củ cà rốt", "2 củ khoai tây", "Hành tây, tỏi", "Sả, lá bay", "Cà chua 2 quả", "Nước mắm, muối, tiêu", "Bột ngũ vị hương ít"],
    instructions: ["Bò rửa, cắt miếng, chần sơ", "Phi hành tỏi sả thơm", "Xào bò đến đổi màu", "Thêm cà chua, xào mềm", "Đổ nước hầm đến ngập bò", "Hầm 60 phút, thêm cà rốt khoai tây 30 phút tiếp"],
    tips: "Chần bò qua nước sôi loại bọt trước khi hầm để nước trong hơn."
  },
  {
    id: "41", name: "Cơm gạo lứt hải sản xào tỏi",
    description: "Tôm mực xào tỏi thơm ăn với cơm gạo lứt — nạp protein hải sản đa dạng amino acid sau tập.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "20 phút", cookTime: "15 phút", servings: "2 người", difficulty: "Dễ",
    calories: "460 kcal", cuisine: "Việt Nam",
    ingredients: ["200g tôm", "200g mực càng", "200g gạo lứt", "Tỏi 5 tép", "Ớt chuông", "Nước mắm, tiêu, dầu olive", "Hành lá, ngò"],
    instructions: ["Nấu cơm gạo lứt", "Sơ chế tôm và mực, để ráo", "Phi tỏi thơm với dầu olive", "Xào hải sản lửa lớn 3-4 phút", "Thêm ớt chuông đảo nhanh", "Nêm nước mắm tiêu, bày ra cùng cơm"],
    tips: "Hải sản phải lửa lớn và nhanh tay — để lâu sẽ dai và ra nước."
  },
  {
    id: "42", name: "Bánh ít nhân đậu xanh",
    description: "Bánh ít truyền thống nhân đậu xanh hấp — đồ ngọt ít đường cho người tập có thể thưởng thức.",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "30 phút", cookTime: "30 phút", servings: "10 cái", difficulty: "Khó",
    calories: "160 kcal", cuisine: "Việt Nam",
    ingredients: ["200g bột nếp", "200g đậu xanh cà vỏ", "100ml nước cốt dừa", "Đường ít, muối", "Lá dứa, lá chuối", "Vừng trắng"],
    instructions: ["Ngâm đậu xanh 3 tiếng, hấp chín, nghiền nhuyễn", "Xào đậu với ít đường, nước cốt dừa đến dẻo", "Trộn bột nếp với nước lá dứa, nhào mịn", "Cán bột, gói nhân đậu xanh", "Bọc lá chuối, hấp 20 phút"],
    tips: "Nhào bột nếp đến khi không dính tay mới đạt độ dẻo chuẩn."
  },
  {
    id: "43", name: "Khoai lang hầm dừa",
    description: "Khoai lang nấu nước cốt dừa — dessert sạch, sweetness tự nhiên, bổ sung carb cho ngày tập cardio.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "10 phút", cookTime: "20 phút", servings: "3 người", difficulty: "Dễ",
    calories: "240 kcal", cuisine: "Việt Nam",
    ingredients: ["400g khoai lang tím", "200ml nước cốt dừa", "200ml nước", "Đường ít", "Muối nhỏ", "Lá dứa"],
    instructions: ["Gọt vỏ khoai lang, cắt miếng vừa", "Nấu nước với lá dứa đến sôi", "Cho khoai vào nấu 15 phút mềm", "Thêm nước cốt dừa", "Nêm ít đường, muối", "Ăn nóng hoặc lạnh đều ngon"],
    tips: "Khoai lang tím chứa anthocyanin — chất chống oxy hóa rất tốt cho phục hồi cơ."
  },
  {
    id: "44", name: "Cá trích nướng muối ớt",
    description: "Cá trích nướng nguyên con với muối ớt — nguồn omega-3 rẻ tiền, protein cao cho người tập.",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "10 phút", cookTime: "15 phút", servings: "2 người", difficulty: "Dễ",
    calories: "300 kcal", cuisine: "Việt Nam",
    ingredients: ["4 con cá trích", "Muối hạt 2 muỗng", "Ớt bột 1 muỗng", "Tỏi bột", "Dầu ăn", "Chanh, rau thơm"],
    instructions: ["Cá trích rửa sạch, khứa 2-3 đường hai bên", "Ướp muối ớt tỏi đều lên cá", "Để ngấm 15 phút", "Nướng than hoa hoặc lò 200°C 15 phút", "Lật giữa chừng đến vàng đều", "Ăn kèm cơm và rau sống"],
    tips: "Cá trích mỡ nên không cần thêm dầu nhiều — vị tự nhiên đã rất ngon."
  },
  {
    id: "45", name: "Gỏi ngó sen tôm thịt",
    description: "Gỏi ngó sen giòn ngon với tôm thịt — ít calo, nhiều chất xơ, món ăn phụ lý tưởng trong thực đơn fitness.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "25 phút", cookTime: "15 phút", servings: "3 người", difficulty: "Trung bình",
    calories: "220 kcal", cuisine: "Việt Nam",
    ingredients: ["300g ngó sen", "200g tôm luộc", "150g thịt heo luộc", "Cà rốt bào sợi", "Rau thơm, ngò gai", "Nước trộn: nước mắm chanh ớt tỏi đường", "Đậu phộng rang"],
    instructions: ["Ngó sen bào mỏng, ngâm nước muối", "Luộc tôm, thịt heo chín để nguội thái mỏng", "Pha nước trộn chua ngọt", "Vắt ráo ngó sen", "Trộn tất cả nguyên liệu với nước trộn", "Rắc đậu phộng và rau thơm"],
    tips: "Ngâm ngó sen trong nước chanh để không bị đen và giữ độ giòn."
  },
  {
    id: "46", name: "Nước ép xanh detox gym",
    description: "Nước ép rau xanh với gừng và chanh — detox sau ngày tập nặng, bổ sung enzyme và vitamin tự nhiên.",
    image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "10 phút", cookTime: "0 phút", servings: "1 người", difficulty: "Dễ",
    calories: "80 kcal", cuisine: "Quốc tế",
    ingredients: ["2 cây cần tây", "1 quả dưa leo", "1 nắm rau bina", "1 quả táo xanh", "Gừng tươi 15g", "1/2 quả chanh", "200ml nước lọc"],
    instructions: ["Rửa sạch tất cả nguyên liệu", "Táo, dưa leo cắt miếng vừa", "Cho vào máy ép lạnh hoặc máy xay", "Thêm nước lọc nếu cần", "Lọc bã nếu dùng máy xay", "Uống ngay để giữ enzyme"],
    tips: "Máy ép lạnh (cold press) giữ enzyme tốt hơn máy xay thông thường."
  },
  {
    id: "47", name: "Đậu hũ sốt thịt bằm kiểu Tứ Xuyên",
    description: "Mapo tofu phiên bản nhẹ hơn — đậu hũ mềm sốt thịt cay umami, protein thực vật và động vật kết hợp.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "15 phút", cookTime: "15 phút", servings: "3 người", difficulty: "Trung bình",
    calories: "290 kcal", cuisine: "Trung Hoa",
    ingredients: ["400g đậu hũ non", "150g thịt heo bằm", "Tương đậu Tứ Xuyên 2 muỗng", "Tỏi, gừng, hành lá", "Nước tương, dầu mè", "Tiêu Tứ Xuyên (hoặc tiêu thường)", "Tinh bột, ít nước"],
    instructions: ["Đậu hũ cắt hạt lựu 2cm, chần qua nước muối", "Phi tỏi gừng với ít dầu", "Xào thịt bằm chín", "Thêm tương đậu xào thơm", "Đổ nước vào, thêm đậu hũ nhẹ nhàng", "Nêm nước tương, dầu mè, dùng bột nước làm sệt"],
    tips: "Chần đậu hũ trong nước muối giúp đậu chắc hơn, không vỡ khi nấu."
  },
  {
    id: "48", name: "Sườn bò nướng mật ong tỏi",
    description: "Short ribs bò nướng mật ong tỏi — bữa ăn tăng cơ high-protein dịp cuối tuần cho people tập gym.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "30 phút", cookTime: "25 phút", servings: "3 người", difficulty: "Trung bình",
    calories: "580 kcal", cuisine: "Hàn Quốc",
    ingredients: ["600g sườn bò (갈비)", "3 muỗng nước tương", "2 muỗng mật ong", "5 tép tỏi bằm", "Gừng bào, hành tím", "1 muỗng dầu mè", "Vừng trắng rang, hành lá"],
    instructions: ["Sườn bò chần sơ qua nước sôi", "Pha sốt ướp từ nước tương mật ong tỏi gừng dầu mè", "Ướp sườn ít nhất 2 tiếng hoặc qua đêm", "Nướng than hoa 12 phút mỗi mặt", "Phết thêm sốt trong khi nướng", "Rắc vừng, hành lá khi ra đĩa"],
    tips: "Ướp qua đêm để gia vị ngấm sâu vào thịt — vị đậm và mềm hơn nhiều."
  },
  {
    id: "49", name: "Bột mì nguyên cám pizza rau",
    description: "Pizza bột mì nguyên cám ít phô mai với nhiều rau củ — carb phức hợp, chất xơ cao cho ngày refeed.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "40 phút", cookTime: "15 phút", servings: "2 người", difficulty: "Trung bình",
    calories: "420 kcal", cuisine: "Ý",
    ingredients: ["200g bột mì nguyên cám", "7g men nở", "Nước ấm, dầu olive, muối", "2 muỗng sốt cà chua", "Mozzarella ít béo 80g", "Ớt chuông, nấm, bông cải, hành tây", "Oregano, húng quế"],
    instructions: ["Trộn bột với men, nước ấm, dầu, nhào 10 phút", "Ủ bột 30 phút cho nở", "Cán mỏng, phết sốt cà chua", "Xếp rau củ lên mặt pizza", "Rắc phô mai mozzarella", "Nướng 220°C 12-15 phút đến viền vàng"],
    tips: "Cán bột mỏng hơn 3mm để pizza giòn và ít calo hơn."
  },
  {
    id: "50", name: "Cơm cuộn rong biển rice bowl",
    description: "Rice bowl kiểu onigiri với cơm gạo lứt, cá ngừ, và rong biển — bữa ăn nhẹ tiện lợi mang đến gym.",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "15 phút", cookTime: "30 phút", servings: "2 người", difficulty: "Dễ",
    calories: "380 kcal", cuisine: "Nhật Bản",
    ingredients: ["200g gạo Nhật hoặc gạo lứt", "1 hộp cá ngừ đóng hộp", "Rong biển nori 4 tờ", "Dưa muối Nhật (umeboshi) hoặc dưa leo", "Vừng trắng rang", "Nước tương ít muối, dầu mè", "Giấm gạo, ít đường"],
    instructions: ["Nấu cơm, trộn giấm gạo đường ít muối khi cơm còn nóng", "Trộn cá ngừ với ít nước tương dầu mè", "Múc cơm vào tô", "Xếp cá ngừ lên giữa", "Thêm dưa muối, vừng", "Cuộn rong biển xung quanh hoặc cắt nhỏ rắc lên"],
    tips: "Cơm phải mới nấu và còn ấm để dễ vo cuộn — cơm nguội sẽ rời và không kết dính."
  },
  {
    id: "51", name: "Cơm sắn ức gà xào sả ớt",
    description: "Sắn luộc thay cơm giúp tinh bột chuyển hóa chậm, kèm ức gà xào sả ớt đậm vị Việt.",
    image: "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "15 phút", cookTime: "25 phút", servings: "2 người", difficulty: "Dễ",
    calories: "450 kcal", cuisine: "Việt Nam",
    ingredients: ["300g ức gà", "200g sắn (khoai mì)", "Sả băm, ớt băm, tỏi", "Nước mắm, đường kiêng", "Dầu olive", "Rau luộc kèm theo"],
    instructions: ["Sắn gọt vỏ luộc chín tới, cắt miếng", "Ức gà thái cục ướp sả ớt mắm 10 phút", "Phi thơm tỏi sả xào gà săn lại", "Dùng sắn ăn thay cơm trắng cùng gà xào"],
    tips: "Luộc sắn với chút muối để ngon hơn, bỏ lõi sắn."
  },
  {
    id: "52", name: "Salad bò Úc nướng sốt chanh leo",
    description: "Thịt thăn bò nướng mềm trộn xà lách, vị sốt chanh leo chua ngọt không béo.",
    image: "https://images.unsplash.com/photo-1603360946279-d579b2a75fb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "10 phút", cookTime: "10 phút", servings: "1 người", difficulty: "Trung bình",
    calories: "320 kcal", cuisine: "Fusion",
    ingredients: ["150g thăn bò Úc", "Rau hỗn hợp xà lách", "Cà chua bi, dưa leo", "1 quả chanh leo", "Mật ong, muối tiêu, dầu olive"],
    instructions: ["Bò ướp muối tiêu áp chảo chín tới, thái mỏng", "Chắt nước chanh leo, pha mật ong dầu olive làm sốt", "Xếp rau ra đĩa, xếp thịt bò, rưới sốt trộn đều"],
    tips: "Để thịt bò nghỉ 3 phút trước khi thái để giữ nước thịt ngọt."
  },
  {
    id: "53", name: "Bánh kếp lúa mạch việt quất",
    description: "Bánh pancake làm từ yến mạch và chuối tươi, topping việt quất cho bữa sáng nhiều năng lượng.",
    image: "https://images.unsplash.com/photo-1528207776546-32248a4f4718?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "10 phút", cookTime: "10 phút", servings: "2 người", difficulty: "Dễ",
    calories: "350 kcal", cuisine: "Quốc tế",
    ingredients: ["100g bột yến mạch", "1 quả chuối chín", "1 quả trứng", "100ml sữa hạt", "Việt quất tươi", "Mật ong"],
    instructions: ["Xay nhuyễn yến mạch, chuối, trứng, sữa", "Chảo chống dính phết xíu dầu, đổ bột nướng vàng 2 mặt", "Xếp bánh, thêm việt quất và rưới ít mật ong"],
    tips: "Chảo phải nóng vừa để bánh xốp và không bị cháy mặt."
  },
  {
    id: "54", name: "Mì khoai lang thịt băm Hàn Quốc",
    description: "Mì làm từ sợi khoai lang (dangmyeon) dai ngon calo thấp trộn ức gà băm.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "20 phút", cookTime: "15 phút", servings: "2 người", difficulty: "Trung bình",
    calories: "380 kcal", cuisine: "Hàn Quốc",
    ingredients: ["150g miến khoai lang", "150g ức gà băm", "Cải bó xôi, cà rốt", "Nước tương tương đen, dầu mè", "Tỏi, tiêu, vừng rang"],
    instructions: ["Luộc miến 6 phút, xả nước lạnh", "Xào rau củ cho chín tới", "Xào ức gà băm với tỏi và gia vị", "Trộn chung miến, rau, thịt băm với tương đen dầu mè"],
    tips: "Luộc miến xong nên trộn xíu dầu mè ngay để sợi không bị dính vào nhau."
  },
  {
    id: "55", name: "Cơm rang tôm gạo súp lơ",
    description: "Thay vì dùng cơm gạo trắng, dùng súp lơ trắng xay vụn xào cùng tôm cực ít tinh bột (Keto/Lowcarb).",
    image: "https://images.unsplash.com/photo-1623961988960-9d04defcefd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "10 phút", cookTime: "15 phút", servings: "1 người", difficulty: "Dễ",
    calories: "280 kcal", cuisine: "Châu Á",
    ingredients: ["200g súp lơ trắng", "150g tôm sú bóc vỏ", "1 quả trứng", "Hành lá, hạt đậu hà lan", "Nước tương, tiêu"],
    instructions: ["Xay súp lơ trắng thành hạt nhỏ cỡ hạt gạo", "Chiên trứng lốc qua để riêng", "Xào chín tôm, cho súp lơ vụn vào đảo 4-5 phút", "Trộn trứng, hành lá nêm nếm tắt bếp"],
    tips: "Súp lơ xào nhanh tay lửa lớn, không nên để quá lâu sẽ bị chảy nước bấy."
  },
  {
    id: "56", name: "Wrap gà nướng sữa chua",
    description: "Bánh cuộn bắp tortilla với ức gà áp chảo ăn kèm sốt sữa chua Hy Lạp thanh mát.",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "10 phút", cookTime: "10 phút", servings: "1 người", difficulty: "Dễ",
    calories: "410 kcal", cuisine: "Mexico/Fusion",
    ingredients: ["1 vỏ bánh tortilla nguyên cám", "150g ức gà xé", "Xà lách, mùi ta", "3 muỗng sữa chua Hy Lạp không đường", "Tỏi băm, chanh, ớt"],
    instructions: ["Trộn sữa chua với cốt chanh, tỏi băm làm sốt", "Chảo khô làm nóng ấm vỏ bánh tortilla", "Trải vỏ bánh, lót rau, xếp gà xé, rưới sốt cuộn chặt"],
    tips: "Vỏ bánh úp chảo 15s mỗi mặt là đủ, lâu hơn vỏ gãy."
  },
  {
    id: "57", name: "Súp bí đỏ kem cốt dừa",
    description: "Súp bí ngô mịn thơm với chút cốt dừa, phù hợp cho ngày nhẹ bụng hoặc Eat Clean chay.",
    image: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "15 phút", cookTime: "30 phút", servings: "3 người", difficulty: "Dễ",
    calories: "220 kcal", cuisine: "Phương Tây",
    ingredients: ["500g bí đỏ", "100ml nước cốt dừa light", "1 củ hành tây", "Nước cốt hầm rau quả", "Muối, tiêu sọ, hạt bí rang"],
    instructions: ["Bí đỏ gọt vỏ, thái khối hấp hoặc xào với hành tây cho thơm", "Đổ nước dùng ninh mềm bí 15 phút", "Xay nhuyễn mịn vớt cốt dừa nêm nếm", "Múc ra tô rắc hạt bí"],
    tips: "Muốn súp ngậy mùi có thể nướng bí đỏ trước khi nấu súp."
  },
  {
    id: "58", name: "Sandwich nguyên cám bơ trứng",
    description: "Sandwich quốc dân của giới fitness: Bánh mì nâu giòn ăn kèm quả bơ béo tốt và trứng gà ốp.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "5 phút", cookTime: "5 phút", servings: "1 người", difficulty: "Rất dễ",
    calories: "380 kcal", cuisine: "Phương Tây",
    ingredients: ["2 lát bánh mì nguyên cám", "1/2 quả bơ sáp chín", "1-2 quả trứng gà", "Muối hồng, tiêu, chanh"],
    instructions: ["Bánh mì nướng giòn bằng lò nướng dẹt hoặc áp chảo", "Bơ dầm nhuyễn với xíu muối, chanh, phết lên bánh", "Trứng ốp la đặt lên trên bơ, rắc tiêu"],
    tips: "Sử dụng dầu xịt (cook spray) để trứng ốp la giảm tối đa calo dẫu mỡ."
  },
  {
    id: "59", name: "Thịt heo luộc cuộn cải bẹ xanh",
    description: "Món ăn thanh tao cực Việt Nam: Nạc thăn heo luộc cuộn lá cải chấm mù tạt chua cay.",
    image: "https://images.unsplash.com/photo-1510693245450-428612140e43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "10 phút", cookTime: "20 phút", servings: "2 người", difficulty: "Dễ",
    calories: "310 kcal", cuisine: "Việt Nam",
    ingredients: ["300g thăn nạc heo (không mỡ)", "Cải bẹ xanh lá bản to", "Hành lá chần", "Pha nước chấm chanh tỏi ớt, ít mù tạt (wasabi)"],
    instructions: ["Heo luộc gừng hành cho thơm, vớt ra thái con chì dài", "Cải bẹ rửa sạch chia lá", "Dùng lá cải cuộn miếng thịt, buộc bằng cọng hành chần", "Chấm nước chấm pha loãng"],
    tips: "Luộc thăn nạc đừng lâu quá thịt bị xơ, nên ngâm nước đá lạnh cho giòn."
  },
  {
    id: "60", name: "Đậu phụ Tứ Xuyên chay ức gà",
    description: "Phiên bản Mapo Tofu cay nồng giảm calo: dùng ức gà băm thay thịt lợn mỡ.",
    image: "https://images.unsplash.com/photo-1513442542250-854d436a73f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "15 phút", cookTime: "15 phút", servings: "2 người", difficulty: "Trung bình",
    calories: "250 kcal", cuisine: "Trung Quốc",
    ingredients: ["1 hộp đậu hũ non", "150g ức gà băm mịn", "Sốt tương cay Tứ Xuyên (Doubanjiang)", "Hành lá, gừng, tỏi, bột hoa tiêu", "Bột năng nêm xíu nước"],
    instructions: ["Đậu thái vuông chần nước muối ấm nóng", "Phi thơm tỏi gừng, xào thịt gà áp vàng", "Cho tương cay vào xào ra màu dầu, hế nước dùng đun sôi", "Trút đậu hũ vào lắc nhẹ chảo, chế bột năng làm sệt sốt", "Rắc hành lá, tiêu Tứ Xuyên"],
    tips: "Không dùng đũa khuấy mạnh sẽ nát đậu non, chỉ cầm cán chảo lắc nhẹ."
  },
  {
    id: "61", name: "Cá basa áp chảo sốt chanh tây",
    description: "Thịt cá fillet mềm áp chảo sốt chua dịu bơ chanh tây không ngấy mỡ.",
    image: "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "10 phút", cookTime: "15 phút", servings: "2 người", difficulty: "Dễ",
    calories: "280 kcal", cuisine: "Quốc tế",
    ingredients: ["300g phi lê cá basa/cá trắng", "Nửa quả chanh vàng tây", "10g bơ lạt", "Mùi tây băm nhỏ", "Muối, tiêu sọ đen"],
    instructions: ["Phi lê cá ướp muối tiêu, áp chảo chín vàng 2 mặt vớt ra", "Dùng chảo đó, vắt chanh thả bơ lạt khuấy tan tắt lửa", "Rưới sốt bơ chanh lên cá, rắc mùi tây xắt nhỏ"],
    tips: "Cá basa khá mềm nên để lửa hơi lớn áp nhanh tạo lớp vỏ áp chảo săn."
  },
  {
    id: "62", name: "Khoai tây bỏ lò thảo mộc",
    description: "Khoai tây nướng giòn thay vì chiên ngập dầu, nguồn tinh bột tốt ăn kèm các món chính.",
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "15 phút", cookTime: "35 phút", servings: "3 người", difficulty: "Dễ",
    calories: "160 kcal", cuisine: "Phương Tây",
    ingredients: ["3 củ khoai tây vừa", "1 muỗng dầu olive", "Hương thảo mộc (rosemary/thyme)", "Bột tỏi, muối hạt to, tiêu"],
    instructions: ["Khoai tây để nguyên vỏ rửa kĩ, bổ múi cau", "Sơ luộc khoai 5 phút lọc ráo", "Xóc khoai với dầu olive và mộc thảo", "Nướng bằng nồi chiên không dầu 200°C 20-25 phút cho xém cạnh"],
    tips: "Luộc sơ trước khi nướng giúp khoai tây mềm trong bột và ngoài giòn tan."
  },
  {
    id: "63", name: "Smothie Bowl hạt chia quả mọng",
    description: "Sinh tố tô sền sệt siêu topping ăn như kem mà rất heathy, calo đẹp cho buổi sáng.",
    image: "https://images.unsplash.com/photo-1556881286-fc6915169721?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "10 phút", cookTime: "0 phút", servings: "1 người", difficulty: "Rất dễ",
    calories: "320 kcal", cuisine: "Hiện đại",
    ingredients: ["1 quả chuối đông đá cứng", "100g dâu tây việt quất đông lạnh", "50ml sữa tươi không đường/nước dừa", "Hạt chia, hạnh nhân lát, quả tươi làm topping"],
    instructions: ["Bỏ trái cây đông đá và ít rữa vào cối nghiền nhuyễn", "Đổ hỗn hợp ra tô nông", "Xếp topping hạt quả cắt dẹp trên mặt", "Xúc ăn bằng muỗng để cảm nhận độ lạnh dẻo"],
    tips: "Trái cây bắt buộc đông đá cứng mới ra được chất sánh dẻo như kem."
  },
  {
    id: "64", name: "Cơm trộn Hàn Quốc Bibimbap lứt",
    description: "Bibimbap healthy với toàn rau và thịt nạc, dùng gạo lứt và sốt gochujang pha ít đường.",
    image: "https://images.unsplash.com/photo-1553163147-622ab57ecd16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "25 phút", cookTime: "15 phút", servings: "1 người", difficulty: "Trung bình",
    calories: "450 kcal", cuisine: "Hàn Quốc",
    ingredients: ["1 chén con cơm gạo lứt", "1 quả trứng ốp la", "50g thịt bò xào", "Cải bó xôi, giá đỗ, nấm kim châm, cà rốt", "Tương ớt Hàn, dầu mè"],
    instructions: ["Các loại rau củ thái sợi, chần/xào riêng từng món nêm xíu muối", "Thịt bò xào nhanh", "Lót cơm ở đáy tô, xếp rau thịt hoa văn vòng tròn", "Thêm trứng ốp ở giữa, rưới tương ớt và dầu mè trộn đều"],
    tips: "Pha loãng Gochujang với chút nước lọc và đường kiêng để sốt dễ trộn và bớt calo."
  },
  {
    id: "65", name: "Nộm gà xé hoa chuối",
    description: "Hoa chuối chống oxy hóa mạnh trộn cùng ức gà xé, mắm chua ngọt, cực tốt cho người ăn eat-clean.",
    image: "https://images.unsplash.com/photo-1548841445-56faea257b44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "20 phút", cookTime: "20 phút", servings: "3 người", difficulty: "Trung bình",
    calories: "210 kcal", cuisine: "Việt Nam",
    ingredients: ["300g ức gà luộc xé phay", "300g hoa chuối thái mỏng", "Cà rốt bào sợi", "Rau răm, ngò rí, đậu phộng rang", "Nước cốt chanh, nước mắm, tỏi ớt băm"],
    instructions: ["Hoa chuối thái tới đâu ngâm nước chanh pha loãng tới đó bớt chát, vớt vắt kiệt", "Hòa mắm chanh tỏi ớt chua ngọt nêm vừa", "Trộn gà, hoa chuối, cà rốt với sốt cho thấm", "Nhặt rau thơm rắc lên trên, rắc đậu phộng"],
    tips: "Hoa chuối ngâm chanh/đá giúp trắng hoa và vô cùng giòn sật."
  },
  {
    id: "66", name: "Pudding hạt chia trà xanh matcha",
    description: "Tráng miệng nhưng đủ chất macro: pudding hạt chia nức matcha chống lão hóa.",
    image: "https://images.unsplash.com/photo-1582046294717-d5d144dbec0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "5 phút", cookTime: "0 phút", servings: "1 người", difficulty: "Rất dễ",
    calories: "260 kcal", cuisine: "Fusion",
    ingredients: ["3 muỗng hạt chia", "150ml sữa tươi/sữa hạnh nhân", "1 muỗng bột matcha nguyên chất", "Mật ong, xoài ngọt xắt lựu"],
    instructions: ["Hòa tan bột matcha với lớp nước ấm xíu", "Đổ sữa và mật ong, quấy chia đều", "Giữ tủ lạnh ít nhất 4 tiếng hoặc qua đêm để chia ngậm nước nở nhuyễn mượt", "Trang trí xoài tươi bên trên"],
    tips: "Nhớ khuấy hạt chia làm 2 lần cách nhau 15 phút đầu tiên để chia không bị quón cục."
  },
  {
    id: "67", name: "Súp lơ nhồi ức gà đút lò",
    description: "Thịt gà băm nhét vô giữa hoa bông cải xanh, rắc chút phô mai đút lò ăn không bị khô gắt.",
    image: "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "20 phút", cookTime: "25 phút", servings: "2 người", difficulty: "Trung bình",
    calories: "340 kcal", cuisine: "Âu",
    ingredients: ["1 búp súp lơ xanh lớn", "200g ức gà xay nhuyễn", "Hành tây, mộc nhĩ dăm", "Muối, tiêu tây, phô mai lát giảm béo"],
    instructions: ["Súp lơ chẻ nhẽ gốc, trần nước sôi", "Ức gà ướp gia vị bóp nhuyễn nhét nhẹ giữa các nhánh súp lơ", "Đặt súp lơ lên khay lò nướng 180°C 20 phút", "5 phút cuối phủ lát phô mai cho chảy mặt"],
    tips: "Dùng tăm đâm ức gà nhét đều vô lõi để bông cải xanh chín không rớt thịt ra."
  },
  {
    id: "68", name: "Cà tím nướng mỡ hành",
    description: "Món phụ đậm chất chay xơ, nướng thơm lừng nhưng dùng xịt olive thay dầu mỡ độc hại.",
    image: "https://images.unsplash.com/photo-1579691370838-89547d79b900?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "10 phút", cookTime: "15 phút", servings: "2 người", difficulty: "Dễ",
    calories: "90 kcal", cuisine: "Việt Nam",
    ingredients: ["2 trái cà tím", "Hành lá", "Nước tương, 1 xíu dầu olive"],
    instructions: ["Cà tím để nguyên vỏ rửa sạch, xăm đâm nướng bằng nồi chiên lột xác chảo nhôm", "Hành lá trụng dầu olive nóng làm mỡ hành healthy", "Cà chín xé dọc dầm nước tương, trét mỡ hành lên"],
    tips: "Bỏ cà tím vô nồi chiên không dầu nướng nhàn và nhanh hơn than nướng xưa."
  },
  {
    id: "69", name: "Tôm rim củ đậu (sắn dừa)",
    description: "Món mặn mâm cơm Eat-clean với củ đậu thanh mát gỡ ngán tôm sú săn chắc mặn mà.",
    image: "https://images.unsplash.com/photo-1564834744159-ff0ea41ba4b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "15 phút", cookTime: "20 phút", servings: "3 người", difficulty: "Trung bình",
    calories: "250 kcal", cuisine: "Việt Nam",
    ingredients: ["300g tôm thẻ lột sạch", "1 củ đậu (củ sắn) thái vuông xóc", "Nước màu dừa, tỏi, tiêu, nước mắm", "Hành lá chẻ"],
    instructions: ["Tôm rang sơ cho chẻ", "Nêm phi tỏi, mắm, mầu", "Dội củ đậu, xào lửa hơi to đảo mặn mòi giòn mềm thì ngưng", "Rắc tiêu sọ cho thơm"],
    tips: "Củ đậu ra nước nên khi rim tôm bật lửa riu riu rút cạn nước sệt."
  },
  {
    id: "70", name: "Nem lụi ức gà nướng sả",
    description: "Phiên bản nem lụi miền Trung siêu dồi dào đạm, thay heo tôm mỡ bằng ức gà bọc sả nướng lụi than.",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "25 phút", cookTime: "15 phút", servings: "3 người", difficulty: "Khó",
    calories: "320 kcal", cuisine: "Việt Nam",
    ingredients: ["400g ức gà xay nhuyễn", "Sả cây", "Giò sống (rất nhỏ để dính)", "Hành tím, tỏi, bột ngọt mắm", "Rau cuốn"],
    instructions: ["Trộn thịt bò gà với cốt hành, tỏi, bóp dẻo dai nhuyễn quết tốt", "Bọc thịt quấn quanh que thân sả", "Nướng áp chảo/Air Fryer 180°C xịt một chút dầu olive cho bóng", "Cuốn rau xà lách dưa leo"],
    tips: "Bóp gà thêm dầu xíu quết sẽ dẻo không bị bã bờ khô vỡ."
  },
  {
    id: "71", name: "Chả giò nướng healthy",
    description: "Chả giò (nem rán) không ngập dầu phi mỡ, nhân cực kì nạc thanh.",
    image: "https://images.unsplash.com/photo-1601314167389-8a58a9e40049?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "40 phút", cookTime: "20 phút", servings: "4 người", difficulty: "Trung bình",
    calories: "280 kcal", cuisine: "Việt Nam",
    ingredients: ["Thịt băm nạc vai/tôm", "Miến, mộc nhĩ", "Cà rốt su hào", "Bánh đa nem", "Lòng đỏ trứng phết"],
    instructions: ["Nhân trộn đều cuốn chặt bằng bánh tráng", "Phết sệt lòng đỏ trứng ở khe cuốn chả lên vỏ bánh tạo màu nướng", "Lò chiên không dầu 180°C 15 phút đảo mặt nướng tiếp 5 phút"],
    tips: "Phết vỏ bánh đa bằng trứng chút giấm giúp màu chả giò bóng rộm ngon không mỡ."
  },
  {
    id: "72", name: "Bò kho gân ít béo",
    description: "Bò kho thơm sả lừng lẫy, nhiều gân thăn nạc không dùng mỡ, collagen chực nhiều.",
    image: "https://images.unsplash.com/photo-1615486171448-4fd67ac0a3fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "30 phút", cookTime: "120 phút", servings: "4 người", difficulty: "Khó",
    calories: "450 kcal", cuisine: "Việt Nam",
    ingredients: ["500g bắp bò nạc lõi hoa gân", "Cà chua sả quế hồi", "Cà rốt tỏi", "Bột bò kho ngũ vị hương"],
    instructions: ["Sơ chế thịt xắn cục, ướp ngũ vị 2 tiếng", "Hầm nhừ với hoa hồi gừng sả lá thơm trong vòng 2 giờ (nồi áp suất 30')", "Châm cà rốt vô luộc sôi lút là chín mềm"],
    tips: "Hớt sạch lớp váng bò dầu mỡ nổi khi ninh sôi thì tô thập cẩm bò kho siêu gầy nạc mĩ miều."
  },
  {
    id: "73", name: "Trà đào chanh sả quế",
    description: "Nước detox giải nhiệt thay giải bia khát cực phê mà lượng đường ZERO.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "10 phút", cookTime: "15 phút", servings: "2 người", difficulty: "Dễ",
    calories: "10 kcal", cuisine: "VietNam/Tea",
    ingredients: ["Trà đen oolong", "Sả đập dập đun", "Đào tươi ngâm diet", "Syrup đường ăn kiêng lỏng", "Chanh"],
    instructions: ["Đun cành sả ngâm quế sôi thơm hãm trà đen", "Để nguội lọc nước", "Pha vào cốc đã đá viên róc rót, si-ro lỏng quấy đều", "Thả vài cọng sả miếng đào"],
    tips: "Đào phải giòn cắn tươi chứ đào đóng lon hộp thiếc ốp là đường hóa học sệt rất béo."
  },
  {
    id: "74", name: "Muffin chuối đậu gà",
    description: "Bánh bông lan nướng dạng muffin ngọt thay bột tẻ bằng đậu gà hầm say cực ngon hi-protein.",
    image: "https://images.unsplash.com/photo-1621236378699-8597faf6a176?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "25 phút", cookTime: "25 phút", servings: "6 cái", difficulty: "Mức cao",
    calories: "180 kcal", cuisine: "Âu-Bánh",
    ingredients: ["1 hộp đậu gà đã hấp xay cực nhuyễn ko vỏ", "Ban chuối chín tán", "2 trứng", "Vani bột nổi, đường mật bưởi dừa", "Mảnh chocola vụn đen đắng 80%"],
    instructions: ["Trộn tán đều khô với ướt, xay cho nổi xốp", "Thả chocolate chips vào lộn quấy tròn", "Đổ chia khuôn cupcakes nướng 180°C tầm 20-30 phút xiên que thấy khô ráo rãnh"],
    tips: "Đậu gà làm vỏ lõi thay bột nở nên ăn bánh hơi cứng nhẹ ẩm ẩm chớ mềm bục vì ko bơ sữa."
  },
  {
    id: "75", name: "Đậu cuộn rong tía tô chay",
    description: "Thanh mát vị tía tô bọc đậu mềm dăm nhúng sốt me đậu đen, Vegan Pro",
    image: "https://images.unsplash.com/photo-1547496502-affa22d38842?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    prepTime: "15 phút", cookTime: "10 phút", servings: "2 người", difficulty: "Dễ",
    calories: "150 kcal", cuisine: "Việt/Phật",
    ingredients: ["Đậu hũ truyền thống bào mảnh", "Lá bọc tía tô / rong mỏng", "Hành baro, sắn mộc nhĩ làm nhân", "Sốt tương dừa"],
    instructions: ["Dầm đậu với sắn nhĩ nêm mặn chay vừa quết", "Thả vo miếng bọc lá tía tô dán kín", "Chiên khẽ chảo tefel ko mỡ lăn mặt", "Gởi sốt tương me rim lướt thơm rắc hành"],
    tips: "Lá tía tô rất rễ rách khi gặp nhiệt, quấn khéo chít mặt hở đè trượt chảo teflon 1 xíu thôi."
  }
];

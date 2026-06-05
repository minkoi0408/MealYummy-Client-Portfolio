import React, { useState, useEffect } from "react";
import { Table, Button, Input, Space, Tag, Modal, Form, Select, InputNumber, message, Upload, Image, Popconfirm, Row, Col } from "antd";
import { Plus, Search, Edit2, Trash2, ShieldAlert, Upload as UploadIcon, MinusCircle, FileJson, Download } from "lucide-react";
import { mealApi, type MealResponseDTO, type MealRequestDTO } from "../../../../apis/meal.api";
import { categoryApi, type Category } from "../../../../apis/category.api";
import { tagApi, type Tag as TagType } from "../../../../apis/tag.api";
import { ingredientApi, type Ingredient } from "../../../../apis/ingredient.api";
import { dataApi } from "../../../../apis/data.api";

export function MealManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [data, setData] = useState<MealResponseDTO[]>([]);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleExport = async () => {
    try {
      await dataApi.exportMeals();
      message.success("Xuất dữ liệu thành công! File đã được lưu trên máy chủ (resources/json).");
    } catch (err) {
      message.error("Lỗi khi xuất dữ liệu.");
    }
  };

  const customUploadRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      await dataApi.importMeals(file as File);
      message.success("Import dữ liệu thành công!");
      fetchData(currentPage, pageSize);
      onSuccess?.("ok");
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lỗi khi import dữ liệu.");
      onError?.(err);
    }
  };

  const fetchData = async (page: number, size: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await mealApi.getAll(page - 1, size);
      if (response.data?.data) {
        setData(response.data.data.content || []);
        setTotal(response.data.data.page?.totalElements || response.data.data.totalElements || 0);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Lỗi khi tải danh sách món ăn";
      message.error({ content: errorMsg, key: 'fetch-error' });
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchDependencies = async () => {
    try {
      const [catRes, tagRes, ingRes] = await Promise.all([
        categoryApi.getAll(0, 1000),
        tagApi.getAll(0, 1000),
        ingredientApi.getAll(0, 1000)
      ]);
      if (catRes.data?.data) setCategories(catRes.data.data.content || []);
      if (tagRes.data?.data) setTags(tagRes.data.data.content || []);
      if (ingRes.data?.data) setIngredients(ingRes.data.data.content || []);
    } catch (error) {
      console.error("Lỗi khi tải phụ thuộc:", error);
    }
  };

  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (isModalOpen && categories.length === 0) {
      fetchDependencies();
    }
  }, [isModalOpen]);

  const handleSaveMeal = async () => {
    try {
      const values = await form.validateFields();
      
      const payload: MealRequestDTO = {
        name: values.name,
        description: values.description || "",
        price: {
          minPrice: values.minPrice || 0,
          maxPrice: values.maxPrice || values.minPrice || 0
        },
        categoryIds: values.categories || [],
        tagIds: values.tags || [],
        ingredients: (values.ingredients || []).map((ing: any) => ({
          ingredientId: ing.ingredientId,
          value: ing.value,
          unit: ing.unit || "G"
        })),
        nutrition: {
          calories: values.calories || 0,
          protein: values.protein || 0,
          carbs: values.carbs || 0,
          fat: values.fat || 0,
          fiber: values.fiber || 0
        }
      };

      if (payload.ingredients.length === 0) {
        message.error("Vui lòng thêm ít nhất 1 nguyên liệu.");
        return;
      }

      let savedMealId = "";

      if (editingId) {
        const res = await mealApi.update(editingId, payload);
        savedMealId = res.data.data?.id || editingId;
        message.success("Cập nhật món ăn thành công!");
      } else {
        const res = await mealApi.create(payload);
        savedMealId = res.data.data?.id || "";
        message.success("Tạo món ăn thành công!");
      }
      
      if (savedMealId && selectedFile) {
         try {
           await mealApi.uploadImage(savedMealId, selectedFile);
           message.success("Upload ảnh thành công!");
         } catch (imgErr: any) {
           message.error("Món ăn đã lưu nhưng lỗi upload ảnh: " + (imgErr.response?.data?.message || ""));
         }
      }
      
      setIsModalOpen(false);
      form.resetFields();
      setSelectedFile(null);
      setEditingId(null);
      fetchData(currentPage, pageSize);
    } catch (err: any) {
      if (err.response?.data?.message) {
        message.error(err.response.data.message);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await mealApi.delete(id);
      message.success("Xóa món ăn thành công!");
      fetchData(currentPage, pageSize);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lỗi khi xóa món ăn.");
    }
  };

  const openEditModal = (record: MealResponseDTO) => {
    setEditingId(record.id);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      minPrice: record.price?.minPrice,
      maxPrice: record.price?.maxPrice,
      categories: record.categories?.map(c => c.id) || [],
      tags: record.tags?.map(t => t.id) || [],
      ingredients: record.ingredients?.map(i => ({
        ingredientId: i.ingredientId,
        value: i.value,
        unit: i.unit
      })) || [],
      calories: record.nutrition?.calories,
      protein: record.nutrition?.protein,
      carbs: record.nutrition?.carbs,
      fat: record.nutrition?.fat,
      fiber: record.nutrition?.fiber
    });
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'images',
      key: 'images',
      width: '10%',
      render: (images: any[]) => {
        const thumbnail = images?.find(img => img.isThumbnail) || images?.[0];
        return thumbnail ? <Image src={thumbnail.url} width={50} height={50} className="rounded object-cover" /> : <div className="w-[50px] h-[50px] bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">Trống</div>;
      }
    },
    { title: 'Tên món ăn', dataIndex: 'name', key: 'name', width: '20%', render: (text: string) => <span className="font-semibold text-gray-800">{text}</span> },
    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', width: '15%' },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: { minPrice: number, maxPrice: number }) => {
        if (!price) return '-';
        if (price.minPrice === price.maxPrice) return <span className="font-medium text-[#10B981]">{price.minPrice?.toLocaleString()} ₫</span>;
        return <span className="font-medium text-[#10B981]">{price.minPrice?.toLocaleString()} - {price.maxPrice?.toLocaleString()} ₫</span>;
      }
    },
    {
      title: 'Dinh dưỡng',
      key: 'nutrition',
      width: '15%',
      render: (_, record: MealResponseDTO) => {
        if (!record.nutrition) return <span className="text-gray-400">-</span>;
        return (
          <div className="flex flex-col gap-1 text-xs">
            <span className="font-semibold text-orange-600">{record.nutrition.calories} kcal</span>
            <span className="text-gray-500">P: {record.nutrition.protein}g | C: {record.nutrition.carbs}g | F: {record.nutrition.fat}g</span>
          </div>
        );
      }
    },
    {
      title: 'Danh mục',
      dataIndex: 'categories',
      key: 'categories',
      render: (cats: any[]) => (
        <Space size={[0, 4]} wrap>
          {cats?.map((cat, i) => <Tag color="blue" key={i}>{cat.name}</Tag>)}
        </Space>
      )
    },
    {
      title: 'Thẻ',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: any[]) => (
        <Space size={[0, 4]} wrap>
          {tags?.map((tag, i) => <Tag color="orange" key={i}>{tag.name}</Tag>)}
        </Space>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      key: 'active',
      width: '10%',
      render: (active: boolean) => (
        <Tag color={active ? 'success' : 'default'} className="px-3 py-1 rounded-full font-medium border-0">
          {active ? 'Hiện' : 'Ẩn'}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '10%',
      render: (_, record: MealResponseDTO) => (
        <Space size="middle">
          <Button 
            type="text" 
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50" 
            icon={<Edit2 className="w-4 h-4" />} 
            onClick={() => openEditModal(record)}
          />
          <Popconfirm
            title="Xóa món ăn này?"
            description="Bạn có chắc chắn muốn xóa món ăn này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger className="hover:bg-red-50" icon={<Trash2 className="w-4 h-4" />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];


  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <ShieldAlert className="w-16 h-16 mb-4 text-red-500" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Không thể truy cập</h3>
        <p className="text-gray-500 text-center max-w-md mb-6">{error}</p>
        <Button onClick={() => { setError(""); fetchData(currentPage, pageSize); }} className="h-10 px-6 rounded-lg">
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Món ăn</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý danh sách món ăn, giá và thành phần nguyên liệu.</p>
        </div>
        <div className="flex gap-2">
          <Button
            icon={<Download className="w-4 h-4" />}
            className="h-10 px-4 rounded-lg font-medium border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-400"
            onClick={handleExport}
          >
            Export JSON
          </Button>
          <Upload customRequest={customUploadRequest} showUploadList={false} accept=".json">
            <Button
              icon={<UploadIcon className="w-4 h-4" />}
              className="h-10 px-4 rounded-lg font-medium border-gray-200 text-gray-700 hover:text-orange-600 hover:border-orange-400"
            >
              Import JSON
            </Button>
          </Upload>
          <Button
            type="primary"
            icon={<Plus className="w-4 h-4" />}
            className="bg-[#10B981] hover:bg-[#059669] h-10 px-6 rounded-lg font-medium shadow-md shadow-[#10B981]/20 ml-2"
            onClick={() => {
              setEditingId(null);
              form.resetFields();
              setIsModalOpen(true);
            }}
          >
            Thêm món ăn
          </Button>
        </div>
      </div>

      <div className="flex mb-6">
        <Input
          placeholder="Tìm kiếm món ăn..."
          prefix={<Search className="w-4 h-4 text-gray-400" />}
          className="max-w-md h-10 rounded-lg hover:border-[#10B981] focus:border-[#10B981]"
        />
      </div>

      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }
        }}
        className="[&_.ant-table-thead_th]:bg-gray-50 [&_.ant-table-thead_th]:text-gray-500 [&_.ant-table-thead_th]:font-semibold border border-gray-100 rounded-lg overflow-hidden"
      />

      <Modal
        title={editingId ? "Chỉnh sửa món ăn" : "Thêm món ăn mới"}
        open={isModalOpen}
        onOk={handleSaveMeal}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setSelectedFile(null);
          setEditingId(null);
        }}
        width={900}
        okButtonProps={{ className: "bg-[#10B981] hover:bg-[#059669]" }}
        okText="Lưu món ăn"
        cancelText="Hủy"
        style={{ top: 20 }}
      >
        <Form form={form} layout="vertical" className="mt-4 max-h-[72vh] overflow-y-auto px-2 pb-6 custom-scroll">
          {/* Group 1: Basic Info */}
          <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-200 mb-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-black shadow-inner">1</span>
              Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-2 gap-x-6">
              <Form.Item label={<span className="font-medium text-gray-700">Tên món ăn</span>} name="name" rules={[{ required: true, message: 'Vui lòng nhập tên' }]} className="col-span-2">
                <Input placeholder="VD: Phở bò đặc biệt" size="large" className="rounded-xl border-gray-300 focus:border-blue-500 hover:border-blue-400" />
              </Form.Item>

              <Form.Item label={<span className="font-medium text-gray-700">Giá thấp nhất (VNĐ)</span>} name="minPrice" rules={[{ required: true, message: 'Nhập giá min' }]}>
                <InputNumber
                  className="w-full rounded-xl border-gray-300 focus:border-blue-500 hover:border-blue-400"
                  size="large"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  placeholder="0"
                  min={0}
                />
              </Form.Item>

              <Form.Item label={<span className="font-medium text-gray-700">Giá cao nhất (VNĐ)</span>} name="maxPrice" rules={[{ required: true, message: 'Nhập giá max' }]}>
                <InputNumber
                  className="w-full rounded-xl border-gray-300 focus:border-blue-500 hover:border-blue-400"
                  size="large"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  placeholder="0"
                  min={0}
                />
              </Form.Item>

              <Form.Item label={<span className="font-medium text-gray-700">Mô tả chi tiết</span>} name="description" className="col-span-2">
                <Input.TextArea placeholder="Mô tả hương vị, cách chế biến, thành phần nổi bật..." rows={3} className="rounded-xl border-gray-300 focus:border-blue-500 hover:border-blue-400 p-3" />
              </Form.Item>

              <Form.Item label={<span className="font-medium text-gray-700">Hình ảnh (Tải lên)</span>} className="col-span-2 mb-0">
                <Upload 
                  beforeUpload={(file) => {
                    setSelectedFile(file);
                    return false; // Prevent auto upload
                  }}
                  maxCount={1}
                  accept="image/*"
                  fileList={selectedFile ? [selectedFile as any] : []}
                  onRemove={() => setSelectedFile(null)}
                >
                  <Button icon={<UploadIcon className="w-4 h-4" />} className="h-10 rounded-xl px-6 border-gray-300 hover:border-blue-500 hover:text-blue-600">Chọn ảnh từ máy tính</Button>
                </Upload>
                {editingId && !selectedFile && (
                   <div className="text-xs text-gray-500 mt-2 italic flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> Để trống nếu không muốn đổi ảnh hiện tại.</div>
                )}
              </Form.Item>
            </div>
          </div>

          {/* Group 2: Categorization */}
          <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100 mb-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-black shadow-inner">2</span>
              Phân loại món ăn
            </h3>
            <div className="grid grid-cols-2 gap-x-6">
              <Form.Item label={<span className="font-medium text-gray-700">Danh mục</span>} name="categories" rules={[{ required: true, message: 'Chọn ít nhất 1 danh mục' }]} className="col-span-2">
                <Select mode="multiple" size="large" placeholder="Chọn danh mục phù hợp (VD: Ăn sáng, Healthy...)" className="rounded-xl [&_.ant-select-selector]:rounded-xl" showSearch optionFilterProp="children">
                  {categories.map(c => <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>)}
                </Select>
              </Form.Item>

              <Form.Item label={<span className="font-medium text-gray-700">Thẻ (Tags)</span>} name="tags" className="col-span-2 mb-0">
                <Select mode="multiple" size="large" placeholder="Thêm thẻ (VD: Ít béo, Nhiều đạm...)" className="rounded-xl [&_.ant-select-selector]:rounded-xl" showSearch optionFilterProp="children">
                  {tags.map(t => <Select.Option key={t.id} value={t.id}>{t.name}</Select.Option>)}
                </Select>
              </Form.Item>
            </div>
          </div>

          {/* Group 3: Nutrition */}
          <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-100 mb-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-black shadow-inner">3</span>
              Thông tin dinh dưỡng
            </h3>
            <div className="grid grid-cols-5 gap-x-4">
              <Form.Item label={<span className="font-medium text-gray-700">Calories</span>} name="calories" rules={[{ required: true, message: 'Nhập kcal' }]}>
                <InputNumber placeholder="kcal" className="w-full rounded-xl" min={0} size="large" />
              </Form.Item>
              <Form.Item label={<span className="font-medium text-gray-700">Protein</span>} name="protein" rules={[{ required: true, message: 'Nhập g' }]}>
                <InputNumber placeholder="g" className="w-full rounded-xl" min={0} size="large" />
              </Form.Item>
              <Form.Item label={<span className="font-medium text-gray-700">Carbs</span>} name="carbs" rules={[{ required: true, message: 'Nhập g' }]}>
                <InputNumber placeholder="g" className="w-full rounded-xl" min={0} size="large" />
              </Form.Item>
              <Form.Item label={<span className="font-medium text-gray-700">Fat</span>} name="fat" rules={[{ required: true, message: 'Nhập g' }]}>
                <InputNumber placeholder="g" className="w-full rounded-xl" min={0} size="large" />
              </Form.Item>
              <Form.Item label={<span className="font-medium text-gray-700">Fiber</span>} name="fiber" rules={[{ required: true, message: 'Nhập g' }]}>
                <InputNumber placeholder="g" className="w-full rounded-xl" min={0} size="large" />
              </Form.Item>
            </div>
          </div>

          {/* Group 4: Ingredients */}
          <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-black shadow-inner">4</span>
                Công thức / Nguyên liệu <span className="text-red-500 text-sm">*</span>
              </h3>
            </div>
            <p className="text-sm text-gray-500 mb-5 ml-11">Thêm chính xác các nguyên liệu cấu thành.</p>
            
            <div className="ml-2">
              <Form.List name="ingredients">
                {(fields, { add, remove }) => (
                  <>
                    <div className="space-y-3 mb-4">
                      {fields.map(({ key, name, ...restField }) => (
                        <Row key={key} gutter={16} align="middle" className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-sm relative group transition-all hover:border-emerald-300 hover:shadow-md">
                          <Col span={10}>
                            <Form.Item {...restField} name={[name, 'ingredientId']} rules={[{ required: true, message: 'Chọn nguyên liệu' }]} className="mb-0">
                              <Select placeholder="🔍 Tìm nguyên liệu..." size="large" showSearch optionFilterProp="label" options={ingredients.map(i => ({label: i.name, value: i.id}))} className="w-full font-medium [&_.ant-select-selector]:rounded-lg" />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item {...restField} name={[name, 'value']} rules={[{ required: true, message: 'Nhập số lượng' }]} className="mb-0">
                              <InputNumber placeholder="Định lượng" size="large" className="w-full rounded-lg" min={0} />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item {...restField} name={[name, 'unit']} rules={[{ required: true, message: 'Chọn ĐV' }]} className="mb-0">
                              <Select placeholder="Đơn vị" size="large" className="[&_.ant-select-selector]:rounded-lg">
                                <Select.Option value="G">Gram (g)</Select.Option>
                                <Select.Option value="KG">Kilogram (kg)</Select.Option>
                                <Select.Option value="ML">Mililit (ml)</Select.Option>
                                <Select.Option value="L">Lít (L)</Select.Option>
                                <Select.Option value="TSP">M. cà phê (tsp)</Select.Option>
                                <Select.Option value="TBSP">M. canh (tbsp)</Select.Option>
                                <Select.Option value="PIECE">Cái/Trái</Select.Option>
                                <Select.Option value="CLOVE">Tép</Select.Option>
                                <Select.Option value="BUNCH">Bó</Select.Option>
                                <Select.Option value="BOWL">Tô/Bát</Select.Option>
                                <Select.Option value="PINCH">Nhúm</Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={2} className="flex justify-center">
                            <Button 
                              type="text" 
                              danger 
                              icon={<Trash2 className="w-5 h-5" />} 
                              onClick={() => remove(name)}
                              className="opacity-40 hover:opacity-100 hover:bg-red-50 w-10 h-10 rounded-full flex items-center justify-center transition-all"
                            />
                          </Col>
                        </Row>
                      ))}
                    </div>
                    <Form.Item className="mb-0">
                      <Button type="dashed" onClick={() => add()} block icon={<Plus className="w-5 h-5" />} className="h-14 rounded-xl border-dashed border-2 border-emerald-300 text-emerald-600 hover:text-emerald-700 hover:border-emerald-400 bg-emerald-50/30 hover:bg-emerald-50 transition-colors font-medium text-base">
                        Thêm nguyên liệu mới
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

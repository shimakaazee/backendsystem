const AddForm = forwardRef(({ region, role }) => {
  return (
    <Form
      layout="vertical"
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[{ required: true, message: '请输入用户名!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[{ required: true, message: '请输入密码!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="region"
        label="区域"
        rules={[{ required: true, message: '请选择区域!' }]}
      >
        <Select>
          {
            region.map(item => {
              return <Option value={item.value} key={item.id} >{item.title}</Option>
            })
          }
        </Select>
      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色"
        rules={[{ required: true, message: '请选择角色!' }]}
      >
        <Select>
          {
            role.map(item => {
              return <Option value={item.id} key={item.id} >{item.roleName}</Option>
            })
          }
        </Select>
      </Form.Item>
    </Form>
  )
})

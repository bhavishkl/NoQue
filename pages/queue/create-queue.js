import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/layout'
import { toast } from 'react-toastify'
import CreateQueueSkeleton from '../../components/skeletons/CreateQueueSkeleton'
import { Form, Input, InputNumber, Select, Button, Typography, Space } from 'antd'
import { ClockCircleOutlined, EnvironmentOutlined, UserOutlined, InfoCircleOutlined, TagOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography
const { TextArea } = Input
const { Option } = Select

export default function CreateQueue() {
  const [form] = Form.useForm()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/queue/category')
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to fetch categories')
    }
  }

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      const response = await fetch('/api/queue/create-queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          estimated_service_time: parseInt(values.estimated_service_time),
          max_capacity: parseInt(values.max_capacity),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create queue')
      }

      await response.json()
      toast.success('Queue created successfully!')
      router.push('/queue/queue-dashboard')
    } catch (error) {
      console.error('Error creating queue:', error)
      toast.error('Failed to create queue. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <CreateQueueSkeleton />
      </Layout>
    )
  }

  const serviceTimeOptions = [
    { value: 5, label: '5 minutes' },
    { value: 10, label: '10 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' },
    { value: 180, label: '3 hours' },
    { value: 240, label: '4 hours' },
    { value: 300, label: '5 hours' },
  ]

  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <Title level={2}>Create New Queue</Title>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="name" label="Queue Name" rules={[{ required: true, message: 'Please enter queue name' }]}>
            <Input placeholder="Enter queue name" />
          </Form.Item>

          <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter description' }]}>
            <TextArea rows={3} placeholder="Describe the purpose of this queue" />
          </Form.Item>

          <Form.Item name="location" label="Location" rules={[{ required: true, message: 'Please enter location' }]}>
            <Input prefix={<EnvironmentOutlined />} placeholder="Enter queue location" />
          </Form.Item>

          <Form.Item name="estimated_service_time" label="Estimated Service Time (minutes)" rules={[{ required: true, message: 'Please enter estimated service time' }]}>
            <Select
              placeholder="Select or enter estimated service time"
              suffixIcon={<ClockCircleOutlined />}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <InputNumber
                    min={1}
                    placeholder="Custom time"
                    style={{ width: '100%', marginTop: 8 }}
                    onPressEnter={(e) => {
                      const value = parseInt(e.target.value);
                      if (value && value > 0) {
                        form.setFieldsValue({ estimated_service_time: value });
                      }
                    }}
                  />
                </>
              )}
            >
              {serviceTimeOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="max_capacity" label="Max Capacity" rules={[{ required: true, message: 'Please enter maximum capacity' }]}>
            <InputNumber min={1} prefix={<UserOutlined />} placeholder="Enter maximum capacity" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="category_id" label="Category" rules={[{ required: true, message: 'Please select a category' }]}>
            <Select placeholder="Select a category" suffixIcon={<TagOutlined />}>
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>{category.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Paragraph>
                <InfoCircleOutlined /> Make sure to provide accurate information for your queue. This will help users decide whether to join your queue.
              </Paragraph>
              <Button type="primary" htmlType="submit" loading={loading} block>
                {loading ? 'Creating...' : 'Create Queue'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  )
}
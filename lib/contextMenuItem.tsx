import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { MenuItemType } from 'antd/es/menu/hooks/useItems'


export const dropdownMenuItem: MenuItemType[] = [
    {
        key: "rename",
        label: "Rename",
        icon: <EditOutlined />
    },
    {
        key: "delete",
        label: "Delete",
        danger: true,
        icon: <DeleteOutlined />
    }
]

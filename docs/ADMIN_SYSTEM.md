# Hendrix Admin System

A Django-like admin interface built with Next.js, Tailwind CSS, and AWS Amplify.

## Features

### 🔐 Authentication & Authorization

- Super admin access control
- Role-based permissions (USER, ADMIN, SUPER_ADMIN)
- Secure API access with Amplify authorization

### 📊 Dashboard

- Overview statistics for all models
- Quick action buttons
- System information panel

### 🗃️ Model Management

Complete CRUD operations for:

- **Users** - User management with roles and status
- **Posts** - Content management with status tracking
- **Categories** - Hierarchical category system
- **Tags** - Tag management with color coding
- **Settings** - System configuration management
- **Todos** - Task management (legacy support)

### 🎨 User Interface

- Clean, responsive design
- Sidebar navigation
- Modal forms for create/edit operations
- Search and pagination
- Status indicators and color coding

## Technical Architecture

### Schema Design

```typescript
// User management with roles
User: (email, firstName, lastName, role, isActive, lastLoginAt);

// Content management
Post: (title, content, excerpt, status, publishedAt, authorId);
Category: (name, slug, description, parentId, isActive);
Tag: (name, slug, color);

// Many-to-many relationships
PostTag: (postId, tagId);
PostCategory: (postId, categoryId);

// System settings
Setting: (key, value, type, description, isPublic);

// Legacy support
Todo: (content, isDone);
```

### Authorization Rules

- **Public API Key**: Read access for published content
- **Owner**: Full access to own records
- **Groups**: Admin and super admin access levels
- **Super Admins**: Full system access including settings

### Components

#### CrudTable Component

Reusable table component with:

- Generic CRUD operations
- Search functionality
- Pagination
- Modal forms
- Field type handling (string, boolean, datetime, enum)
- Custom renderers

#### Admin Layout

- Responsive sidebar navigation
- Authentication checks
- Role-based access control
- Breadcrumb navigation

## Usage

### Accessing the Admin Panel

1. Navigate to `/admin`
2. Super admin privileges required
3. Use sidebar navigation to manage different models

### Creating Records

1. Click "Create New" button
2. Fill out the modal form
3. Required fields are marked with \*
4. Submit to save

### Editing Records

1. Click "Edit" button in table row
2. Modify fields in modal form
3. Submit to update

### Deleting Records

1. Click "Delete" button in table row
2. Confirm deletion in popup
3. Record is permanently removed

### Search and Pagination

- Use search box to filter records
- Navigate pages with Previous/Next buttons
- 10 records per page by default

## Field Types

### Supported Field Types

- **string**: Text input
- **number**: Numeric input
- **boolean**: Checkbox
- **datetime**: Date/time picker
- **enum**: Dropdown selection
- **select**: Custom dropdown options

### Custom Renderers

Fields can have custom render functions for display:

```typescript
{
  key: 'status',
  label: 'Status',
  type: 'enum',
  render: (value) => <StatusBadge status={value} />
}
```

## Security

### Access Control

- Super admin role required for admin access
- API-level authorization with Amplify
- Client-side route protection

### Data Protection

- Secure API endpoints
- Role-based data filtering
- Input validation and sanitization

## Development

### Adding New Models

1. Define model in `amplify/data/resource.ts`
2. Create admin page in `src/app/admin/[model]/page.tsx`
3. Define field configuration
4. Add navigation link in layout

### Customizing Fields

```typescript
const fields = [
  {
    key: 'fieldName',
    label: 'Display Name',
    type: 'string',
    required: true,
    render: (value, record) => <CustomComponent value={value} />
  }
];
```

### Extending Authorization

Modify authorization rules in schema:

```typescript
.authorization((allow) => [
  allow.publicApiKey().to(['read']),
  allow.groups(['admins', 'super_admins'])
])
```

## File Structure

```
src/app/admin/
├── layout.tsx              # Admin layout with sidebar
├── page.tsx                # Dashboard
├── components/
│   └── CrudTable.tsx       # Reusable CRUD component
├── users/page.tsx          # User management
├── posts/page.tsx          # Post management
├── categories/page.tsx     # Category management
├── tags/page.tsx           # Tag management
├── settings/page.tsx       # Settings management
└── todos/page.tsx          # Todo management

amplify/data/
└── resource.ts             # Data schema definition
```

## Future Enhancements

- [ ] Bulk operations
- [ ] Export/import functionality
- [ ] Advanced filtering
- [ ] Audit logging
- [ ] File upload support
- [ ] Rich text editor for content
- [ ] Real-time updates
- [ ] Advanced user management

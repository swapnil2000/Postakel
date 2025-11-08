/** @format */

import { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import {
	Users,
	Plus,
	Edit,
	Trash2,
	Clock,
	IndianRupee,
	Search,
	UserCheck,
	Shield,
	Key,
	Calendar,
	TrendingUp,
	Settings,
	Award,
	DollarSign,
	CreditCard,
	CheckCircle,
	AlertCircle,
	Eye,
	Save,
	PlayCircle,
	StopCircle,
	RotateCcw,
	Timer,
	History,
	Wallet,
	Receipt,
	PiggyBank,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL; // or VITE_BACKEND_URL if using Vite

export function StaffManagement() {
	const [staff, setStaff] = useState<any[]>([]);
	const [shifts, setShifts] = useState<any[]>([]);
	const [salaryPayments, setSalaryPayments] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	const [searchTerm, setSearchTerm] = useState('');
	const [selectedRole, setSelectedRole] = useState('all');
	const [selectedStaffForShift, setSelectedStaffForShift] =
		useState<string>('');
	const [selectedStaffForPayment, setSelectedStaffForPayment] =
		useState<string>('');
	const [newPayment, setNewPayment] = useState({
		amount: '',
		paymentType: 'Full Salary' as
			| 'Full Salary'
			| 'Partial Payment'
			| 'Advance'
			| 'Bonus'
			| 'Overtime',
		description: '',
		paidBy: '',
	});
	const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<string>('');
	const [rolePermissions, setRolePermissions] = useState<{
		[key: string]: string[];
	}>({});
	const [roleDashboardModules, setRoleDashboardModules] = useState<{
		[key: string]: string[];
	}>({});
	const [selectAllPermissions, setSelectAllPermissions] = useState(false);
	const [selectAllDashboard, setSelectAllDashboard] = useState(false);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [editingStaff, setEditingStaff] = useState<any>(null);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [isDeleting, setIsDeleting] = useState<string | null>(null);

	const [newStaff, setNewStaff] = useState({
		name: '',
		role: '',
		phone: '',
		email: '',
		pin: '',
		salary: '',
		permissions: [] as string[],
		dashboardModules: [] as string[],
	});

	const [shiftType, setShiftType] = useState('');
	const [openingCash, setOpeningCash] = useState('');

	const [roles, setRoles] = useState<string[]>([]);
	const defaultRoles = ['Manager', 'Cashier', 'Waiter', 'Chef', 'Helper'];

	const permissions = [
		{
			id: 'dashboard',
			label: 'Dashboard',
			description: 'Access to main dashboard and overview',
			category: 'core',
		},
		{
			id: 'pos',
			label: 'POS Billing',
			description: 'Access to billing and checkout system',
			category: 'sales',
		},
		{
			id: 'menu',
			label: 'Menu Management',
			description: 'Add, edit, and manage menu items',
			category: 'operations',
		},
		{
			id: 'reports',
			label: 'Reports & Analytics',
			description: 'View sales and performance reports',
			category: 'analytics',
		},
		{
			id: 'settings',
			label: 'Settings',
			description: 'System configuration and setup',
			category: 'admin',
		},
		{
			id: 'tables',
			label: 'Table Management',
			description: 'Manage table reservations and layout',
			category: 'operations',
		},
		{
			id: 'kitchen',
			label: 'Kitchen Display',
			description: 'View and manage kitchen orders',
			category: 'operations',
		},
		{
			id: 'customers',
			label: 'Customer Management',
			description: 'Manage customer data and CRM',
			category: 'sales',
		},
		{
			id: 'marketing',
			label: 'Marketing',
			description: 'Access marketing campaigns and promotions',
			category: 'sales',
		},
		{
			id: 'inventory',
			label: 'Inventory Management',
			description: 'Track and manage stock levels',
			category: 'operations',
		},
		{
			id: 'staff',
			label: 'Staff Management',
			description: 'Manage staff and roles',
			category: 'admin',
		},
		{
			id: 'qr-ordering',
			label: 'QR Ordering',
			description: 'Manage QR code ordering system',
			category: 'sales',
		},
		{
			id: 'suppliers',
			label: 'Supplier Management',
			description: 'Manage vendor relationships',
			category: 'operations',
		},
		{
			id: 'expenses',
			label: 'Expense Management',
			description: 'Track and manage expenses',
			category: 'finance',
		},
		{
			id: 'reservations',
			label: 'Reservation Management',
			description: 'Manage table reservations and bookings',
			category: 'operations',
		},
		{
			id: 'loyalty',
			label: 'Loyalty Program',
			description: 'Manage customer loyalty programs',
			category: 'sales',
		},
		{
			id: 'online-orders',
			label: 'Online Orders Management',
			description: 'Manage orders from Zomato, Swiggy, and website',
			category: 'sales',
		},
	];

	const validateStaff = (staffData: any): { [key: string]: string } => {
		const errors: { [key: string]: string } = {};

		if (!staffData.name.trim()) {
			errors.name = 'Staff name is required';
		} else if (staffData.name.length < 2) {
			errors.name = 'Name must be at least 2 characters';
		}

		if (!staffData.role) {
			errors.role = 'Role is required';
		}

		if (!staffData.phone.trim()) {
			errors.phone = 'Phone number is required';
		} else if (!/^\+?[\d\s-()]{10,}$/.test(staffData.phone)) {
			errors.phone = 'Please enter a valid phone number';
		}

		if (staffData.email && !/\S+@\S+\.\S+/.test(staffData.email)) {
			errors.email = 'Please enter a valid email address';
		}

		if (!staffData.pin.trim()) {
			errors.pin = 'PIN is required';
		} else if (!/^\d{4}$/.test(staffData.pin)) {
			errors.pin = 'PIN must be exactly 4 digits';
		}

		if (!staffData.salary) {
			errors.salary = 'Salary is required';
		} else if (parseFloat(staffData.salary) <= 0) {
			errors.salary = 'Salary must be greater than 0';
		}

		return errors;
	};

	// Fetch staff, shifts, and salaryPayments from backend
	async function loadData() {
		setLoading(true);
		try {
			// ROLES
			try {
				const rolesRes = await fetch(`${API_BASE_URL}/staff/roles`);
				if (rolesRes.ok) {
					const rolesBody = await rolesRes.json();
					if (Array.isArray(rolesBody)) setRoles(rolesBody);
					else if (Array.isArray(rolesBody.roles)) setRoles(rolesBody.roles);
					else setRoles(defaultRoles);
				} else {
					console.error('Roles fetch failed:', rolesRes.status);
					setRoles(defaultRoles);
				}
			} catch (err) {
				console.error('Roles fetch error:', err);
				setRoles(defaultRoles);
			}

			// STAFF
			const staffRes = await fetch(`${API_BASE_URL}/staff`);
			if (!staffRes.ok) {
				console.error('Staff fetch failed:', staffRes.status, await staffRes.text());
				setStaff([]);
			} else {
				const staffBody = await staffRes.json();
				if (Array.isArray(staffBody.staff)) setStaff(staffBody.staff);
				else if (Array.isArray(staffBody)) setStaff(staffBody);
				else setStaff([]);
			}

			// SHIFTS
			const shiftsRes = await fetch(`${API_BASE_URL}/staff/shifts`);
			if (!shiftsRes.ok) {
				console.error('Shifts fetch failed:', shiftsRes.status, await shiftsRes.text());
				setShifts([]);
			} else {
				const shiftsBody = await shiftsRes.json();
				if (Array.isArray(shiftsBody)) setShifts(shiftsBody);
				else if (Array.isArray(shiftsBody.shifts)) setShifts(shiftsBody.shifts);
				else setShifts([]);
			}

			// SALARY PAYMENTS
			const paymentsRes = await fetch(`${API_BASE_URL}/staff/salary-payments`);
			if (!paymentsRes.ok) {
				console.error('Payments fetch failed:', paymentsRes.status, await paymentsRes.text());
				setSalaryPayments([]);
			} else {
				const paymentsBody = await paymentsRes.json();
				if (Array.isArray(paymentsBody)) setSalaryPayments(paymentsBody);
				else if (Array.isArray(paymentsBody.payments)) setSalaryPayments(paymentsBody.payments);
				else setSalaryPayments([]);
			}
		} catch (error) {
			console.error('Error fetching data:', error);
			setStaff([]);
			setShifts([]);
			setSalaryPayments([]);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		loadData();
	}, []);

	// Replace addNewStaff to use API helper and reload
	const addNewStaff = async () => {
		console.log('addNewStaff clicked', newStaff);
     const validationErrors = validateStaff(newStaff);

		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			toast.error('Please fix the validation errors before saving');
			return;
		}

		// Check for duplicate phone or email (client side)
		const existingStaff = staff.find(
			(s) =>
				s.phone === newStaff.phone ||
				(newStaff.email && s.email === newStaff.email)
		);

		if (existingStaff) {
			if (existingStaff.phone === newStaff.phone) {
				setErrors({
					phone: 'A staff member with this phone number already exists',
				});
			} else {
				setErrors({ email: 'A staff member with this email already exists' });
			}
			toast.error('Staff member already exists');
			return;
		}

		try {
			const staffMember = {
				// backend may generate id; sending client id is ok as a fallback
				id: Date.now().toString(),
				name: newStaff.name.trim(),
				role: newStaff.role,
				phone: newStaff.phone.trim(),
				email: newStaff.email.trim(),
				pin: newStaff.pin,
				salary: parseFloat(newStaff.salary),
				permissions: newStaff.permissions,
				dashboardModules: newStaff.dashboardModules,
				status: 'active' as const,
				joinDate: new Date().toISOString().split('T')[0],
				isActive: true,
			};

			await apiAddStaff(staffMember);
			await loadData();

			toast.success('Staff member added successfully');
			addNotification({
				type: 'success',
				title: 'New Staff Added',
				message: `${staffMember.name} has been added to the team`,
				moduleId: 'staff',
			});

			setNewStaff({
				name: '',
				role: '',
				phone: '',
				email: '',
				pin: '',
				salary: '',
				permissions: [],
				dashboardModules: [],
			});
			setErrors({});
			setIsAddDialogOpen(false);
		} catch (error) {
			toast.error('Failed to add staff member');
			console.error('Add staff error:', error);
		}
	};

	// Replace deleteStaffMember to call API and reload
	const deleteStaffMember = async (id: string) => {
		if (
			!confirm(
				'Are you sure you want to delete this staff member? This action cannot be undone.'
			)
		) {
			return;
		}

		setIsDeleting(id);
		try {
			const staffMember = staff.find((s) => s.id === id);
			await apiDeleteStaff(id);
			await loadData();

			toast.success('Staff member deleted successfully');
			addNotification({
				type: 'info',
				title: 'Staff Member Removed',
				message: `${staffMember?.name} has been removed from the team`,
				moduleId: 'staff',
			});
		} catch (error) {
			toast.error('Failed to delete staff member');
			console.error('Delete staff error:', error);
		} finally {
			setIsDeleting(null);
		}
	};

	// Shift Management using API helpers
	const startShift = async (
		staffId: string,
		shiftType: 'Morning' | 'Evening' | 'Night',
		openingCash: number
	) => {
		try {
			const newShift = {
				// backend may create id
				id: Date.now().toString(),
				staffId,
				startTime: new Date().toLocaleTimeString('en-US', {
					hour12: true,
					hour: '2-digit',
					minute: '2-digit',
				}),
				openingCash,
				closingCash: 0,
				totalSales: 0,
				tips: 0,
				date: new Date().toISOString().split('T')[0],
				status: 'Active' as const,
				shiftType,
			};

			await apiAddShift(newShift);
			// update staff currentShift on server
			await apiUpdateStaff(staffId, { currentShift: shiftType });
			await loadData();

			addNotification({
				type: 'success',
				title: 'Shift Started',
				message: `${staff.find((s) => s.id === staffId)?.name} started ${shiftType} shift`,
				moduleId: 'staff',
			});
		} catch (err) {
			console.error('Start shift error:', err);
			toast.error('Failed to start shift');
		}
	};

	const endShift = async (
		shiftId: string,
		closingCash: number,
		totalSales: number,
		tips: number
	) => {
		try {
			await apiUpdateShift(shiftId, {
				endTime: new Date().toLocaleTimeString('en-US', {
					hour12: true,
					hour: '2-digit',
					minute: '2-digit',
				}),
				closingCash,
				totalSales,
				tips,
				status: 'Completed' as const,
			});

			// Clear current shift from staff on backend
			const shift = shifts.find((s) => s.id === shiftId);
			if (shift) {
				await apiUpdateStaff(shift.staffId, { currentShift: null });
			}

			await loadData();

			addNotification({
				type: 'info',
				title: 'Shift Ended',
				message: `${staff.find((s) => s.id === shift?.staffId)?.name} ended their shift`,
				moduleId: 'staff',
			});
		} catch (err) {
			console.error('End shift error:', err);
			toast.error('Failed to end shift');
		}
	};

	const changeStaff = async (shiftId: string, newStaffId: string) => {
		try {
			await apiUpdateShift(shiftId, { staffId: newStaffId });
			await loadData();

			addNotification({
				type: 'info',
				title: 'Shift Assigned',
				message: `Shift assigned to ${staff.find((s) => s.id === newStaffId)?.name}`,
				moduleId: 'staff',
			});
		} catch (err) {
			console.error('Change staff for shift error:', err);
			toast.error('Failed to change shift staff');
		}
	};

	// Salary Payment using API helpers
	const handleAddSalaryPayment = async () => {
		if (
			!selectedStaffForPayment ||
			!newPayment.amount ||
			!newPayment.description ||
			!newPayment.paidBy
		) {
			toast.error('Fill all payment fields');
			return;
		}

		try {
			const payment = {
				id: Date.now().toString(),
				staffId: selectedStaffForPayment,
				amount: parseFloat(newPayment.amount),
				paymentDate: new Date().toISOString().split('T')[0],
				paymentType: newPayment.paymentType,
				description: newPayment.description,
				paidBy: newPayment.paidBy,
				status: 'Completed' as const,
				month: new Date().toLocaleString('default', { month: 'long' }),
				year: new Date().getFullYear(),
			};

			await apiAddSalaryPayment(payment);

			// Optionally update staff payment history on server if supported
			const staffMember = staff.find((s) => s.id === selectedStaffForPayment);
			if (staffMember) {
				const updatedPaymentHistory = [
					...(staffMember.paymentHistory || []),
					{
						id: payment.id,
						month: payment.month || '',
						year: payment.year || 0,
						amount: payment.amount,
						paymentDate: payment.paymentDate,
						status: 'Paid' as const,
						type: payment.paymentType,
						description: payment.description,
						paidBy: payment.paidBy,
					},
				];
				await apiUpdateStaff(selectedStaffForPayment, { paymentHistory: updatedPaymentHistory });
			}

			await loadData();

			addNotification({
				type: 'success',
				title: 'Payment Recorded',
				message: `₹${payment.amount} payment recorded for ${staff.find((s) => s.id === selectedStaffForPayment)?.name}`,
				moduleId: 'staff',
			});

			setNewPayment({
				amount: '',
				paymentType: 'Full Salary',
				description: '',
				paidBy: '',
			});
			setSelectedStaffForPayment('');
		} catch (err) {
			console.error('Add salary payment error:', err);
			toast.error('Failed to record payment');
		}
	};

	const getActiveShiftForStaff = (staffId: string) => {
		return shifts.find(
			(shift) => shift.staffId === staffId && shift.status === 'Active'
		);
	};

	// Compute statistics safely (prevent ReferenceError and handle nulls)
	const stats = {
		totalStaff: Array.isArray(staff) ? staff.length : 0,
		activeStaff: Array.isArray(staff) ? staff.filter((s) => !!s.isActive).length : 0,
		onDuty: Array.isArray(shifts) ? shifts.filter((sh) => sh.status === 'Active').length : 0,
		avgSalary: (() => {
			if (!Array.isArray(staff) || staff.length === 0) return 0;
			const total = staff.reduce((sum, s) => sum + (Number(s?.salary) || 0), 0);
			return Math.round(total / staff.length);
		})(),
	};

	// --- added: safe helpers + filteredStaff ---
	const formatCurrency = (val: any) =>
		Number(val ?? 0).toLocaleString();

	const safeNumber = (val: any) => Number(val ?? 0);

	// Returns a CSS class (or fallback) for a role badge/color
	const getRoleColor = (role?: string) => {
		if (!role) return 'bg-gray-200 text-gray-800';
		const r = role.toString().toLowerCase();
		if (r.includes('manager')) return 'bg-blue-500 text-white';
		if (r.includes('cashier')) return 'bg-green-500 text-white';
		if (r.includes('chef') || r.includes('cook')) return 'bg-red-500 text-white';
		if (r.includes('waiter') || r.includes('server')) return 'bg-yellow-400 text-black';
		if (r.includes('barman') || r.includes('bar')) return 'bg-indigo-500 text-white';
		return 'bg-gray-200 text-gray-800';
	};

	const filteredStaff = Array.isArray(staff)
		? staff.filter((member) => {
				const q = searchTerm.trim().toLowerCase();
				const name = (member?.name || '').toString().toLowerCase();
				const role = (member?.role || '').toString().toLowerCase();
				const matchesSearch = !q || name.includes(q) || role.includes(q);
				const matchesRole = selectedRole === 'all' || !selectedRole || member.role === selectedRole;
				return matchesSearch && matchesRole;
          })
        : [];

	const getDefaultPermissionsForRole = (role: string): string[] => {
		switch (role) {
			case 'Manager':
				return permissions.map((p) => p.id);
			case 'Cashier':
				return [
					'dashboard',
					'pos',
					'reports',
					'customers',
					'loyalty',
					'online-orders',
				];
			case 'Waiter':
				return [
					'dashboard',
					'pos',
					'tables',
					'customers',
					'reservations',
					'qr-ordering',
					'online-orders',
				];
			case 'Chef':
				return [
					'dashboard',
					'kitchen',
					'inventory',
					'menu',
					'suppliers',
					'online-orders',
				];
			case 'Helper':
				return ['dashboard', 'pos', 'kitchen', 'online-orders'];
			default:
				return ['dashboard'];
		}
	};

	const getDefaultDashboardModulesForRole = (role: string): string[] => {
		switch (role) {
			case 'Manager':
				return ['dashboard', 'pos', 'reports', 'staff', 'inventory'];
			case 'Cashier':
				return ['dashboard', 'pos', 'reports', 'customers'];
			case 'Waiter':
				return ['dashboard', 'tables', 'pos', 'customers'];
			case 'Chef':
				return ['dashboard', 'kitchen', 'inventory', 'menu'];
			case 'Helper':
				return ['dashboard', 'kitchen'];
			default:
				return ['dashboard'];
		}
	};

	const handleSelectAllPermissions = (checked: boolean, role: string) => {
		if (checked) {
			setRolePermissions((prev) => ({
				...prev,
				[role]: permissions.map((p) => p.id),
			}));
		} else {
			setRolePermissions((prev) => ({
				...prev,
				[role]: [],
			}));
		}
		setSelectAllPermissions(checked);
	};

	const handleSelectAllDashboard = (checked: boolean, role: string) => {
		if (checked) {
			setRoleDashboardModules((prev) => ({
				...prev,
				[role]: permissions.map((p) => p.id),
			}));
		} else {
			setRoleDashboardModules((prev) => ({
				...prev,
				[role]: [],
			}));
		}
		setSelectAllDashboard(checked);
	};

	const handlePermissionChange = (
		permissionId: string,
		checked: boolean,
		role: string
	) => {
		setRolePermissions((prev) => {
			const currentPermissions =
				prev[role] || getDefaultPermissionsForRole(role);
			if (checked) {
				return {
					...prev,
					[role]: [...currentPermissions, permissionId],
				};
			} else {
				return {
					...prev,
					[role]: currentPermissions.filter((p) => p !== permissionId),
				};
			}
		});
	};

	const handleDashboardModuleChange = (
		moduleId: string,
		checked: boolean,
		role: string
	) => {
		setRoleDashboardModules((prev) => {
			const currentModules =
				prev[role] || getDefaultDashboardModulesForRole(role);
			if (checked) {
				return {
					...prev,
					[role]: [...currentModules, moduleId],
				};
			} else {
				return {
					...prev,
					[role]: currentModules.filter((m) => m !== moduleId),
				};
			}
		});
	};

	async function apiAddStaff(staffData) {
		const token = localStorage.getItem('token');
		await fetch(`${API_BASE_URL}/staff`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(staffData),
		});
		// refetch staff list or update state
	}

	async function apiUpdateStaff(staffId, staffData) {
		const token = localStorage.getItem('token');
		await fetch(`${API_BASE_URL}/staff/${staffId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(staffData),
		});
		// refetch staff list or update state
	}

	async function apiDeleteStaff(staffId) {
		const token = localStorage.getItem('token');
		await fetch(`${API_BASE_URL}/staff/${staffId}`, {
			method: 'DELETE',
			headers: { Authorization: `Bearer ${token}` },
		});
		// refetch staff list or update state
	}

	async function apiAddShift(shiftData) {
		const token = localStorage.getItem('token');
		await fetch(`${API_BASE_URL}/staff/shifts`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(shiftData),
		});
		// refetch shifts list or update state
	}

	async function apiUpdateShift(shiftId, shiftData) {
		const token = localStorage.getItem('token');
		await fetch(`${API_BASE_URL}/staff/shifts/${shiftId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(shiftData),
		});
		// refetch shifts list or update state
	}

	async function apiAddSalaryPayment(paymentData) {
		const token = localStorage.getItem('token');
		await fetch(`${API_BASE_URL}/staff/salary-payments`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(paymentData),
		});
		// refetch salary payments list or update state
	}

	const {
		addStaff,
		deleteStaff,
		addShift,
		updateShift,
		addSalaryPayment,
		updateStaff,
		addNotification,
	} = useAppContext();

	return (
		<div className='p-4 space-y-6'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
				<div>
					<h1 className='text-2xl font-bold text-primary'>Staff Management</h1>
					<p className='text-muted-foreground'>
						Manage staff roles, shifts, and permissions
					</p>
				</div>
				<Dialog>
					<DialogTrigger asChild>
						<Button>
							<Plus className='w-4 h-4 mr-2' />
							Add Staff
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add New Staff Member</DialogTitle>
							<DialogDescription>
								Enter the details for the new staff member and assign their role
								and permissions.
							</DialogDescription>
						</DialogHeader>
						<div className='space-y-4'>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<Label htmlFor='name'>Name</Label>
									<Input
										id='name'
										placeholder='Enter staff name'
										value={newStaff.name}
										onChange={(e) => setNewStaff((p) => ({ ...p, name: e.target.value }))}
									/>
									{errors.name && <div className='text-xs text-red-600 mt-1'>{errors.name}</div>}
								</div>
								<div>
									<Label htmlFor='role'>Role</Label>
									<Select
										value={newStaff.role}
										onValueChange={(v: string) => setNewStaff((p) => ({ ...p, role: v }))}>
										<SelectTrigger>
											<SelectValue placeholder='Select role' />
										</SelectTrigger>
										<SelectContent>
											{roles.map((role) => (
												<SelectItem key={role} value={role}>
													{role}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{errors.role && <div className='text-xs text-red-600 mt-1'>{errors.role}</div>}
								</div>
							</div>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<Label htmlFor='phone'>Phone</Label>
									<Input
										id='phone'
										placeholder='+91 XXXXX XXXXX'
										value={newStaff.phone}
										onChange={(e) => setNewStaff((p) => ({ ...p, phone: e.target.value }))}
									/>
									{errors.phone && <div className='text-xs text-red-600 mt-1'>{errors.phone}</div>}
								</div>
								<div>
									<Label htmlFor='email'>Email</Label>
									<Input
										id='email'
										type='email'
										placeholder='staff@restaurant.com'
										value={newStaff.email}
										onChange={(e) => setNewStaff((p) => ({ ...p, email: e.target.value }))}
									/>
									{errors.email && <div className='text-xs text-red-600 mt-1'>{errors.email}</div>}
								</div>
							</div>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<Label htmlFor='pin'>Login PIN</Label>
									<Input
										id='pin'
										type='password'
										placeholder='4-digit PIN'
										maxLength={4}
										value={newStaff.pin}
										onChange={(e) => setNewStaff((p) => ({ ...p, pin: e.target.value }))}
									/>
									{errors.pin && <div className='text-xs text-red-600 mt-1'>{errors.pin}</div>}
								</div>
								<div>
									<Label htmlFor='salary'>Salary</Label>
									<Input
										id='salary'
										type='number'
										placeholder='Monthly salary'
										value={newStaff.salary}
										onChange={(e) => setNewStaff((p) => ({ ...p, salary: e.target.value }))}
									/>
									{errors.salary && <div className='text-xs text-red-600 mt-1'>{errors.salary}</div>}
								</div>
							</div>
							<Tabs
								defaultValue='permissions'
								className='w-full'>
								<TabsList className='grid w-full grid-cols-2'>
									<TabsTrigger value='permissions'>
										Module Permissions
									</TabsTrigger>
									<TabsTrigger value='dashboard'>Dashboard Display</TabsTrigger>
								</TabsList>

								<TabsContent
									value='permissions'
									className='space-y-4'>
									<div className='flex items-center justify-between'>
										<Label>Module Access Permissions</Label>
										<div className='flex items-center space-x-2'>
											<Checkbox
												id='select-all-permissions-new'
												checked={selectAllPermissions}
												onCheckedChange={(checked) =>
													setSelectAllPermissions(checked as boolean)
												}
											/>
											<Label
												htmlFor='select-all-permissions-new'
												className='text-sm'>
												Select All
											</Label>
										</div>
									</div>
									<div className='grid grid-cols-1 gap-3 max-h-48 overflow-y-auto'>
										{[
											'core',
											'sales',
											'operations',
											'analytics',
											'finance',
											'admin',
										].map((category) => {
											const categoryPermissions = permissions.filter(
												(p) => p.category === category
											);
											if (categoryPermissions.length === 0) return null;

											return (
												<div
													key={category}
													className='space-y-2'>
													<h4 className='font-medium text-sm text-primary capitalize'>
														{category}
													</h4>
													<div className='grid grid-cols-2 gap-2'>
														{categoryPermissions.map((perm) => (
															<div
																key={perm.id}
																className='flex items-start space-x-3 p-2 border rounded-lg'>
																<Checkbox id={perm.id} />
																<div className='flex-1 min-w-0'>
																	<Label
																		htmlFor={perm.id}
																		className='text-sm font-medium'>
																		{perm.label}
																	</Label>
																	<p className='text-xs text-muted-foreground'>
																		{perm.description}
																	</p>
																</div>
															</div>
														))}
													</div>
												</div>
											);
										})}
									</div>
								</TabsContent>

								<TabsContent
									value='dashboard'
									className='space-y-4'>
									<div className='flex items-center justify-between'>
										<Label>Dashboard Modules</Label>
										<div className='flex items-center space-x-2'>
											<Checkbox
												id='select-all-dashboard-new'
												checked={selectAllDashboard}
												onCheckedChange={(checked) =>
													setSelectAllDashboard(checked as boolean)
												}
											/>
											<Label
												htmlFor='select-all-dashboard-new'
												className='text-sm'>
												Select All
											</Label>
										</div>
									</div>
									<p className='text-sm text-muted-foreground mb-4'>
										Select which modules should be visible on the dashboard for
										this staff member.
									</p>
									<div className='grid grid-cols-2 gap-3 max-h-48 overflow-y-auto'>
										{permissions.map((perm) => (
											<div
												key={perm.id}
												className='flex items-start space-x-3 p-2 border rounded-lg'>
												<Checkbox id={`dashboard-${perm.id}`} />
												<div className='flex-1 min-w-0'>
													<Label
														htmlFor={`dashboard-${perm.id}`}
														className='text-sm font-medium'>
														{perm.label}
													</Label>
													<p className='text-xs text-muted-foreground'>
														Show on dashboard
													</p>
												</div>
											</div>
										))}
									</div>
								</TabsContent>
							</Tabs>
							<div className='flex gap-2 pt-4'>
								<Button className='flex-1' onClick={addNewStaff}>
									Add Staff
								</Button>
								<Button variant='outline' className='flex-1' onClick={() => setIsAddDialogOpen(false)}>
									Cancel
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>

			{/* Stats */}
			<div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
				<Card className='p-4 text-center'>
					<div className='text-2xl font-bold text-primary'>
						{stats.totalStaff}
					</div>
					<div className='text-sm text-muted-foreground'>Total Staff</div>
				</Card>
				<Card className='p-4 text-center'>
					<div className='text-2xl font-bold text-green-600'>
						{stats.activeStaff}
					</div>
					<div className='text-sm text-muted-foreground'>Active</div>
				</Card>
				<Card className='p-4 text-center'>
					<div className='text-2xl font-bold text-blue-600'>{stats.onDuty}</div>
					<div className='text-sm text-muted-foreground'>On Duty</div>
				</Card>
				<Card className='p-4 text-center'>
					<div className='text-2xl font-bold text-purple-600'>
						₹{stats.avgSalary.toLocaleString()}
					</div>
					<div className='text-sm text-muted-foreground'>Avg Salary</div>
				</Card>
			</div>

			{/* Filters */}
			<div className='flex flex-col sm:flex-row gap-4'>
				<div className='relative flex-1'>
					<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
					<Input
						placeholder='Search staff by name or role...'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className='pl-10'
					/>
				</div>
				<Select
					value={selectedRole}
					onValueChange={setSelectedRole}>
					<SelectTrigger className='w-full sm:w-48'>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>All Roles</SelectItem>
						{roles.map((role) => (
							<SelectItem
								key={role}
								value={role}>
								{role}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Main Content Tabs */}
			<Tabs
				defaultValue='overview'
				className='space-y-6'>
				<TabsList className='grid w-full grid-cols-5'>
					<TabsTrigger value='overview'>Overview</TabsTrigger>
					<TabsTrigger value='roles'>Role Management</TabsTrigger>
					<TabsTrigger value='shifts'>Shift Management</TabsTrigger>
					<TabsTrigger value='payments'>Salary Payments</TabsTrigger>
					<TabsTrigger value='performance'>Performance</TabsTrigger>
				</TabsList>

				{/* Staff Overview */}
				<TabsContent
					value='overview'
					className='space-y-4'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
						{filteredStaff.map((staffMember) => {
							const activeShift = getActiveShiftForStaff(staffMember.id);
							return (
								<Card
									key={staffMember.id}
									className='p-4'>
									<div className='flex items-start justify-between mb-3'>
										<div className='flex items-center space-x-3'>
											<Avatar>
												<AvatarFallback
													className={`${getRoleColor(
														staffMember.role
													)} text-white`}>
													{(staffMember.name || '')
														.split(' ')
														.map((n: string) => n[0] || '')
														.join('')}
												</AvatarFallback>
											</Avatar>
											<div>
												<h3 className='font-medium'>{staffMember.name}</h3>
												<Badge
													variant='secondary'
													className='text-xs'>
													{staffMember.role}
												</Badge>
											</div>
										</div>
										<div className='flex items-center space-x-2'>
											<Switch checked={staffMember.isActive} />
											<Button
												variant='ghost'
												size='sm'>
												<Edit className='w-4 h-4' />
											</Button>
										</div>
									</div>

									<div className='space-y-2 text-sm'>
										<div className='flex justify-between'>
											<span className='text-muted-foreground'>Phone:</span>
											<span>{staffMember.phone}</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-muted-foreground'>Salary:</span>
											<span>₹{formatCurrency(staffMember.salary)}</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-muted-foreground'>Status:</span>
											<div className='flex items-center space-x-2'>
												{staffMember.currentShift ? (
													<Badge
														className={`text-xs ${getShiftColor(
															staffMember.currentShift
														)}`}>
														{staffMember.currentShift}
													</Badge>
												) : (
													<Badge
														variant='outline'
														className='text-xs'>
														Off Duty
													</Badge>
												)}
											</div>
										</div>
										<div className='flex justify-between'>
											<span className='text-muted-foreground'>
												Performance:
											</span>
											<div className='flex items-center space-x-1'>
												<span>{(staffMember?.performance?.customerRating ?? 0)}/5</span>
												<Award className='w-3 h-3 text-yellow-500' />
											</div>
										</div>
									</div>

									{activeShift && (
										<div className='mt-3 p-2 bg-blue-50 rounded-lg'>
											<div className='text-xs text-blue-700'>
												Active Shift: {activeShift.startTime} • ₹
												{activeShift.openingCash} opening
											</div>
										</div>
									)}
								</Card>
							);
						})}
					</div>
				</TabsContent>

				{/* Role Management */}
				<TabsContent
					value='roles'
					className='space-y-4'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Shield className='w-5 h-5' />
								Role-Based Permissions
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='space-y-6'>
								<div>
									<Label>Select Role to Edit</Label>
									<Select
										value={selectedRoleForEdit}
										onValueChange={setSelectedRoleForEdit}>
										<SelectTrigger>
											<SelectValue placeholder='Choose a role to configure' />
										</SelectTrigger>
										<SelectContent>
											{roles.map((role) => (
												<SelectItem
													key={role}
													value={role}>
													{role}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								{selectedRoleForEdit && (
									<Tabs
										defaultValue='permissions'
										className='w-full'>
										<TabsList className='grid w-full grid-cols-2'>
											<TabsTrigger value='permissions'>
												Module Permissions
											</TabsTrigger>
											<TabsTrigger value='dashboard'>
												Dashboard Modules
											</TabsTrigger>
										</TabsList>

										<TabsContent
											value='permissions'
											className='space-y-4'>
											<div className='flex items-center justify-between'>
												<Label>
													Module Access Permissions for {selectedRoleForEdit}
												</Label>
												<div className='flex items-center space-x-2'>
													<Checkbox
														id='select-all-permissions'
														checked={selectAllPermissions}
														onCheckedChange={(checked) =>
															handleSelectAllPermissions(
																checked as boolean,
																selectedRoleForEdit
															)
														}
													/>
													<Label
														htmlFor='select-all-permissions'
														className='text-sm'>
														Select All
													</Label>
												</div>
											</div>
											<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
												{[
													'core',
													'sales',
													'operations',
													'analytics',
													'finance',
													'admin',
												].map((category) => {
													const categoryPermissions = permissions.filter(
														(p) => p.category === category
													);
													if (categoryPermissions.length === 0) return null;

													return (
														<div
															key={category}
															className='space-y-3'>
															<h4 className='font-medium text-primary capitalize'>
																{category}
															</h4>
															<div className='space-y-2'>
																{categoryPermissions.map((perm) => {
																	const currentPermissions =
																		rolePermissions[selectedRoleForEdit] ||
																		getDefaultPermissionsForRole(
																			selectedRoleForEdit
																		);
																	const isChecked = currentPermissions.includes(
																		perm.id
																	);

																	return (
																		<div
																			key={perm.id}
																			className='flex items-start space-x-3 p-3 border rounded-lg'>
																			<Checkbox
																				id={perm.id}
																				checked={isChecked}
																				onCheckedChange={(checked) =>
																					handlePermissionChange(
																						perm.id,
																						checked as boolean,
																						selectedRoleForEdit
																					)
																				}
																			/>
																			<div className='flex-1 min-w-0'>
																				<Label
																					htmlFor={perm.id}
																					className='font-medium'>
																					{perm.label}
																				</Label>
																				<p className='text-sm text-muted-foreground'>
																					{perm.description}
																				</p>
																			</div>
																		</div>
																	);
																})}
															</div>
														</div>
													);
												})}
											</div>
										</TabsContent>

										<TabsContent
											value='dashboard'
											className='space-y-4'>
											<div className='flex items-center justify-between'>
												<Label>
													Dashboard Modules for {selectedRoleForEdit}
												</Label>
												<div className='flex items-center space-x-2'>
													<Checkbox
														id='select-all-dashboard'
														checked={selectAllDashboard}
														onCheckedChange={(checked) =>
															handleSelectAllDashboard(
																checked as boolean,
																selectedRoleForEdit
															)
														}
													/>
													<Label
														htmlFor='select-all-dashboard'
														className='text-sm'>
														Select All
													</Label>
												</div>
											</div>
											<p className='text-sm text-muted-foreground mb-4'>
												Select which modules should be visible on the dashboard
												for users with the {selectedRoleForEdit} role.
											</p>
											<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
												{permissions.map((perm) => {
													const currentModules =
														roleDashboardModules[selectedRoleForEdit] ||
														getDefaultDashboardModulesForRole(
															selectedRoleForEdit
														);
													const isChecked = currentModules.includes(perm.id);

													return (
														<div
															key={perm.id}
															className='flex items-start space-x-3 p-3 border rounded-lg'>
															<Checkbox
																id={`dashboard-${perm.id}`}
																checked={isChecked}
																onCheckedChange={(checked) =>
																	handleDashboardModuleChange(
																		perm.id,
																		checked as boolean,
																		selectedRoleForEdit
																	)
																}
															/>
															<div className='flex-1 min-w-0'>
																<Label
																	htmlFor={`dashboard-${perm.id}`}
																	className='font-medium'>
																	{perm.label}
																</Label>
																<p className='text-sm text-muted-foreground'>
																	Show on dashboard
																</p>
															</div>
														</div>
													);
												})}
											</div>
										</TabsContent>
									</Tabs>
								)}

								{selectedRoleForEdit && (
									<div className='flex gap-2 pt-4'>
										<Button className='flex-1'>
											<Save className='w-4 h-4 mr-2' />
											Save Role Configuration
										</Button>
										<Button
											variant='outline'
											onClick={() => setSelectedRoleForEdit('')}>
											Cancel
										</Button>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Shift Management */}
				<TabsContent
					value='shifts'
					className='space-y-4'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
						{/* Start New Shift */}
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<PlayCircle className='w-5 h-5' />
									Start New Shift
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div>
									<Label>Select Staff Member</Label>
									<Select
										value={selectedStaffForShift}
										onValueChange={setSelectedStaffForShift}>
										<SelectTrigger>
											<SelectValue placeholder='Choose staff member' />
										</SelectTrigger>
										<SelectContent>
											{staff
												.filter((s) => s.isActive && !s.currentShift)
												.map((staffMember) => (
													<SelectItem
														key={staffMember.id}
														value={staffMember.id}>
														{staffMember.name} - {staffMember.role}
													</SelectItem>
												))}
										</SelectContent>
									</Select>
								</div>
								<div className='grid grid-cols-2 gap-4'>
									<div>
										<Label>Shift Type</Label>
										<Select
											value={shiftType}
											onValueChange={setShiftType}
										>
											<SelectTrigger>
												<SelectValue placeholder='Select shift' />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='Morning'>
													Morning (9 AM - 5 PM)
												</SelectItem>
												<SelectItem value='Evening'>
													Evening (2 PM - 10 PM)
												</SelectItem>
												<SelectItem value='Night'>
													Night (6 PM - 2 AM)
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label>Opening Cash</Label>
										<Input
											type='number'
											placeholder='Amount in ₹'
											value={openingCash}
											onChange={(e) => setOpeningCash(e.target.value)}
										/>
									</div>
								</div>
								<Button
									className='w-full'
									disabled={!selectedStaffForShift || !shiftType || !openingCash}
									onClick={() => {
										startShift(selectedStaffForShift, shiftType as 'Morning' | 'Evening' | 'Night', Number(openingCash));
										setSelectedStaffForShift('');
										setShiftType('');
										setOpeningCash('');
									}}
								>
									<PlayCircle className='w-4 h-4 mr-2' />
									Start Shift
								</Button>
							</CardContent>
						</Card>

						{/* Active Shifts */}
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Timer className='w-5 h-5' />
									Active Shifts
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='space-y-3'>
									{shifts
										.filter((shift) => shift.status === 'Active')
										.map((shift) => {
											const staffMember = staff.find(
												(s) => s.id === shift.staffId
											);
											return (
												<div
													key={shift.id}
													className='flex items-center justify-between p-3 border rounded-lg'>
													<div>
														<div className='font-medium'>
															{staffMember?.name}
														</div>
														<div className='text-sm text-muted-foreground'>
															{shift.shiftType} • Started: {shift.startTime}
														</div>
														<div className='text-sm text-muted-foreground'>
															Opening: ₹{formatCurrency(shift.openingCash)}
														</div>
													</div>
													<div className='flex gap-2'>
														<Button
															variant='outline'
															size='sm'>
															<Edit className='w-4 h-4' />
														</Button>
														<Button size='sm'>
															<StopCircle className='w-4 h-4' />
															End
														</Button>
													</div>
												</div>
											);
										})}
									{shifts.filter((shift) => shift.status === 'Active')
										.length === 0 && (
										<div className='text-center py-8 text-muted-foreground'>
											No active shifts
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Recent Shifts */}
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<History className='w-5 h-5' />
								Recent Shifts
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='space-y-3'>
								{shifts
									.filter((shift) => shift.status === 'Completed')
									.slice(0, 5)
									.map((shift) => {
										const staffMember = staff.find(
											(s) => s.id === shift.staffId
										);
										return (
											<div
												key={shift.id}
												className='flex items-center justify-between p-3 border rounded-lg'>
												<div className='flex-1'>
													<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
														<div>
															<div className='font-medium'>
																{staffMember?.name}
															</div>
															<div className='text-sm text-muted-foreground'>
																{shift.shiftType}
															</div>
														</div>
														<div>
															<div className='text-sm text-muted-foreground'>
																Duration
															</div>
															<div>
																{shift.startTime} - {shift.endTime}
															</div>
														</div>
														<div>
															<div className='text-sm text-muted-foreground'>
																Sales
															</div>
															<div>₹{formatCurrency(shift.totalSales)}</div>
														</div>
														<div>
															<div className='text-sm text-muted-foreground'>
																Tips
															</div>
															<div>₹{formatCurrency(shift.tips)}</div>
														</div>
													</div>
												</div>
												<Button
													variant='ghost'
													size='sm'>
													<Eye className='w-4 h-4' />
												</Button>
											</div>
										);
									})}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Salary Payments */}
				<TabsContent
					value='payments'
					className='space-y-4'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
						{/* Add Payment */}
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<CreditCard className='w-5 h-5' />
									Record Payment
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div>
									<Label>Select Staff Member</Label>
									<Select
										value={selectedStaffForPayment}
										onValueChange={setSelectedStaffForPayment}>
										<SelectTrigger>
											<SelectValue placeholder='Choose staff member' />
										</SelectTrigger>
										<SelectContent>
											{staff
												.filter((s) => s.isActive)
												.map((staffMember) => (
													<SelectItem
														key={staffMember.id}
														value={staffMember.id}>
														{staffMember.name} - {staffMember.role}
													</SelectItem>
												))}
										</SelectContent>
									</Select>
								</div>
								<div className='grid grid-cols-2 gap-4'>
									<div>
										<Label>Payment Type</Label>
										<Select
											value={newPayment.paymentType}
											onValueChange={(value: any) =>
												setNewPayment((prev) => ({
													...prev,
													paymentType: value,
												}))
											}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='Full Salary'>Full Salary</SelectItem>
												<SelectItem value='Partial Payment'>
													Partial Payment
												</SelectItem>
												<SelectItem value='Advance'>Advance</SelectItem>
												<SelectItem value='Bonus'>Bonus</SelectItem>
												<SelectItem value='Overtime'>Overtime</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label>Amount</Label>
										<Input
											type='number'
											placeholder='Amount in ₹'
											value={newPayment.amount}
											onChange={(e) =>
												setNewPayment((prev) => ({
													...prev,
													amount: e.target.value,
												}))
											}
										/>
									</div>
								</div>
								<div>
									<Label>Description</Label>
									<Textarea
										placeholder='Payment description'
										value={newPayment.description}
										onChange={(e) =>
											setNewPayment((prev) => ({
												...prev,
												description: e.target.value,
											}))
										}
									/>
								</div>
								<div>
									<Label>Paid By</Label>
									<Input
										placeholder='Name of person making payment'
										value={newPayment.paidBy}
										onChange={(e) =>
											setNewPayment((prev) => ({
												...prev,
												paidBy: e.target.value,
											}))
										}
									/>
								</div>
								<Button
									className='w-full'
									onClick={handleAddSalaryPayment}>
									<DollarSign className='w-4 h-4 mr-2' />
									Record Payment
								</Button>
							</CardContent>
						</Card>

						{/* Payment Summary */}
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Wallet className='w-5 h-5' />
									Payment Summary
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='space-y-4'>
									<div className='grid grid-cols-2 gap-4'>
										<div className='text-center p-3 bg-green-50 rounded-lg'>
											<div className='text-2xl font-bold text-green-600'>
												₹
												{formatCurrency(
													salaryPayments
														.filter((p) => p.status === 'Completed')
														.reduce((sum, p) => sum + safeNumber(p.amount), 0)
												)}
											</div>
											<div className='text-sm text-green-700'>Total Paid</div>
										</div>
										<div className='text-center p-3 bg-orange-50 rounded-lg'>
											<div className='text-2xl font-bold text-orange-600'>
												₹
												{formatCurrency(
													salaryPayments
														.filter((p) => p.status === 'Pending')
														.reduce((sum, p) => sum + safeNumber(p.amount), 0)
												)}
											</div>
											<div className='text-sm text-orange-700'>Pending</div>
										</div>
									</div>

									<div className='space-y-2'>
										<h4 className='font-medium'>Recent Payments</h4>
										{salaryPayments.slice(0, 3).map((payment) => {
											const staffMember = staff.find(
												(s) => s.id === payment.staffId
											);
											return (
												<div
													key={payment.id}
													className='flex items-center justify-between p-2 border rounded'>
													<div>
														<div className='font-medium text-sm'>
															{staffMember?.name}
														</div>
														<div className='text-xs text-muted-foreground'>
															{payment.paymentType}
														</div>
													</div>
													<div className='text-right'>
														<div className='font-medium'>
															₹{formatCurrency(payment.amount)}
														</div>
														<Badge
															variant={
																payment.status === 'Completed'
																	? 'default'
																	: 'secondary'
															}
															className='text-xs'>
															{payment.status}
														</Badge>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Payment History */}
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Receipt className='w-5 h-5' />
								Payment History
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='space-y-3'>
								{salaryPayments.map((payment) => {
									const staffMember = staff.find(
										(s) => s.id === payment.staffId
									);
									return (
										<div
											key={payment.id}
											className='flex items-center justify-between p-4 border rounded-lg'>
											<div className='flex-1'>
												<div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
													<div>
														<div className='font-medium'>
															{staffMember?.name}
														</div>
														<div className='text-sm text-muted-foreground'>
															{staffMember?.role}
														</div>
													</div>
													<div>
														<div className='text-sm text-muted-foreground'>
															Type
														</div>
														<div>{payment.paymentType}</div>
													</div>
													<div>
														<div className='text-sm text-muted-foreground'>
															Amount
														</div>
														<div>₹{formatCurrency(payment.amount)}</div>
													</div>
													<div>
														<div className='text-sm text-muted-foreground'>
															Date
														</div>
														<div>{payment.paymentDate}</div>
													</div>
													<div>
														<div className='text-sm text-muted-foreground'>
															Status
														</div>
														<Badge
															variant={
																payment.status === 'Completed'
																	? 'default'
																	: 'secondary'
															}>
															{payment.status}
														</Badge>
													</div>
												</div>
												<div className='mt-2 text-sm text-muted-foreground'>
													{payment.description}
												</div>
											</div>
											<Button
												variant='ghost'
												size='sm'>
												<Eye className='w-4 h-4' />
											</Button>
										</div>
									);
								})}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Performance */}
				<TabsContent
					value='performance'
					className='space-y-4'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
						{(Array.isArray(staff) ? staff : []).map((staffMember) => {
							const perf = staffMember?.performance ?? {};
							const salaryDetails = staffMember?.salaryDetails ?? {
								totalSalary: 0,
								baseSalary: 0,
								allowances: 0,
								overtime: 0,
								deductions: 0,
							};
							return (
								<Card key={staffMember.id}>
									<CardHeader className='pb-2'>
										<div className='flex items-center justify-between'>
											<div className='flex items-center space-x-3'>
												<Avatar>
													<AvatarFallback
														className={`${getRoleColor(
															staffMember.role
														)} text-white`}>
														{(staffMember.name || '')
															.split(' ')
															.map((n) => n[0] || '')
															.join('')}
													</AvatarFallback>
												</Avatar>
												<div>
													<CardTitle className='text-lg'>
														{staffMember.name || '—'}
													</CardTitle>
													<Badge
														variant='secondary'
														className='text-xs'>
														{staffMember.role || '—'}
													</Badge>
												</div>
											</div>
										</div>
									</CardHeader>
									<CardContent>
										<div className='space-y-4'>
											<div className='grid grid-cols-2 gap-4'>
												<div className='text-center p-3 bg-blue-50 rounded-lg'>
													<div className='text-2xl font-bold text-blue-600'>
														{Number(perf.ordersHandled ?? 0)}
													</div>
													<div className='text-xs text-blue-700'>
														Orders Handled
													</div>
												</div>
												<div className='text-center p-3 bg-green-50 rounded-lg'>
													<div className='text-2xl font-bold text-green-600'>
														{Number(perf.avgOrderTime ?? 0)}m
													</div>
													<div className='text-xs text-green-700'>
														Avg Order Time
													</div>
												</div>
											</div>

											<div className='space-y-2'>
												<div className='flex justify-between items-center'>
													<span className='text-sm text-muted-foreground'>
														Customer Rating
													</span>
													<div className='flex items-center space-x-1'>
														<span className='font-medium'>
															{(perf.customerRating ?? 0)}/5
														</span>
														<Award className='w-4 h-4 text-yellow-500' />
													</div>
												</div>

												<div className='flex justify-between items-center'>
													<span className='text-sm text-muted-foreground'>
														Total Salary
													</span>
													<span className='font-medium'>
														₹
														{formatCurrency(salaryDetails.totalSalary ?? 0)}
													</span>
												</div>

												<div className='flex justify-between items-center'>
													<span className='text-sm text-muted-foreground'>
														Join Date
													</span>
													<span className='font-medium'>
														{staffMember.joinDate ?? '—'}
													</span>
												</div>
											</div>

											<div className='space-y-2'>
												<h4 className='font-medium text-sm'>Salary Breakdown</h4>
												<div className='text-xs space-y-1'>
													<div className='flex justify-between'>
														<span>Base Salary:</span>
														<span>₹{formatCurrency(salaryDetails.baseSalary ?? 0)}</span>
													</div>
													<div className='flex justify-between'>
														<span>Allowances:</span>
														<span>₹{formatCurrency(salaryDetails.allowances ?? 0)}</span>
													</div>
													<div className='flex justify-between'>
														<span>Overtime:</span>
														<span>₹{formatCurrency(salaryDetails.overtime ?? 0)}</span>
													</div>
													<div className='flex justify-between text-red-600'>
														<span>Deductions:</span>
														<span>-₹{formatCurrency(salaryDetails.deductions ?? 0)}</span>
													</div>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}

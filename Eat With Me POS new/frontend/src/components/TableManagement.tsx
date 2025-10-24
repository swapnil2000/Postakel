/** @format */

import { useState, useEffect } from 'react';
import { useAppContext, Table } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import {
	Users,
	Clock,
	DollarSign,
	Plus,
	UserCheck,
	Coffee,
	Settings,
	Search,
	Printer,
	MessageCircle,
	FileText,
	Percent,
	Trash2,
	Edit2,
	CreditCard,
	Smartphone,
	Banknote,
	Receipt,
} from 'lucide-react';

// export function TableManagement({ onNavigate }: TableManagementProps) {
// 	const {
// 		tables,
// 		updateTable,
// 		addTable,
// 		deleteTable,
// 		getTableStats,
// 		setSelectedTable,
// 		setCurrentOrder,
// 	} = useAppContext();

// 	const [selectedTableLocal, setSelectedTableLocal] = useState<any>(null);
// 	const [searchTerm, setSearchTerm] = useState('');
// 	const [statusFilter, setStatusFilter] = useState('all');
// 	const [showAddTableDialog, setShowAddTableDialog] = useState(false);
// 	const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
// 	const [checkoutTable, setCheckoutTable] = useState<Table | null>(null);
// 	const [discount, setDiscount] = useState(0);
// 	const [customerPhone, setCustomerPhone] = useState('');
// 	const [paymentMethod, setPaymentMethod] = useState('cash');
// 	const [checkoutRemarks, setCheckoutRemarks] = useState('');
// 	const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('compact');

// 	const [newTableForm, setNewTableForm] = useState({
// 		number: '',
// 		capacity: '4',
// 		waiter: 'none',
// 	});

// 	// Debug: Log table statuses for troubleshooting
// 	useEffect(() => {
// 		console.log(
// 			'Table Management - Table Data:',
// 			tables.map((t) => ({
// 				number: t.number,
// 				status: t.status,
// 				id: t.id,
// 			}))
// 		);
// 	}, [tables]);

// 	const handleAddTable = () => {
// 		if (newTableForm.number && newTableForm.capacity) {
// 			const newTable = {
// 				id: Date.now().toString(),
// 				number: parseInt(newTableForm.number),
// 				capacity: parseInt(newTableForm.capacity),
// 				status: 'free' as const,
// 				waiter:
// 					newTableForm.waiter === 'none' ? undefined : newTableForm.waiter,
// 			};

// 			addTable(newTable);
// 			setNewTableForm({ number: '', capacity: '4', waiter: 'none' });
// 			setShowAddTableDialog(false);
// 		}
// 	};

// 	const handleDeleteTable = (tableId: string) => {
// 		deleteTable(tableId);
// 	};

// 	const handleTableAction = (table: any, action: string) => {
// 		if (action === 'start-order' || action === 'resume-order') {
// 			// Set the selected table in global context and navigate to POS
// 			setSelectedTable(table.id);
// 			setCurrentOrder({
// 				tableId: table.id,
// 				tableNumber: table.tableNumber,
// 				type: 'dine-in',
// 			});
// 			onNavigate('pos');
// 		} else if (action === 'checkout') {
// 			setCheckoutTable(table);
// 			setCustomerPhone('');
// 			setDiscount(0);
// 			setPaymentMethod('cash');
// 			setCheckoutRemarks('');
// 			setShowCheckoutDialog(true);
// 		}
// 	};

// 	const calculateTotal = (orderAmount: number, discountPercent: number) => {
// 		const discountAmount = (orderAmount * discountPercent) / 100;
// 		const subtotal = orderAmount - discountAmount;
// 		const gst = subtotal * 0.18;
// 		return subtotal + gst;
// 	};

export function TableManagement({ onNavigate }: { onNavigate: (screen: string) => void }) {
	const token = localStorage.getItem('token') || '';
	const restaurantId = localStorage.getItem('restaurantId') || '';
	const [tables, setTables] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [showAddTableDialog, setShowAddTableDialog] = useState(false);
	const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
	const [checkoutTable, setCheckoutTable] = useState(null);
	const [discount, setDiscount] = useState(0);
	const [customerPhone, setCustomerPhone] = useState('');
	const [paymentMethod, setPaymentMethod] = useState('cash');
	const [checkoutRemarks, setCheckoutRemarks] = useState('');
	const [newTableForm, setNewTableForm] = useState({ number: '', capacity: '4', waiter: 'none' });
	const [isDeleting, setIsDeleting] = useState(null);
	const [viewMode, setViewMode] = useState('compact');

	const fetchTables = async () => {
		const res = await fetch(`${import.meta.env.VITE_API_URL}/tables?restaurantId=${restaurantId}`, {
			headers: { Authorization: `Bearer ${token}` }
		});
		if (res.ok) setTables(await res.json());
	};

	const addTable = async (tableData) => {
		await fetch(`${import.meta.env.VITE_API_URL}/tables`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			body: JSON.stringify({ ...tableData, restaurantId })
		});
		fetchTables();
	};

	const updateTable = async (id, tableData) => {
		await fetch(`${import.meta.env.VITE_API_URL}/tables/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			body: JSON.stringify(tableData)
		});
		fetchTables();
	};

	const deleteTable = async (id) => {
		await fetch(`${import.meta.env.VITE_API_URL}/tables/${id}`, {
			method: 'DELETE',
			headers: { Authorization: `Bearer ${token}` }
		});
		fetchTables();
	};

	useEffect(() => { fetchTables(); }, []);

	const handleAddTable = async () => {
		try {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/tables`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
					body: JSON.stringify({
						number: parseInt(newTableForm.number),
						capacity: parseInt(newTableForm.capacity),
						waiter: newTableForm.waiter === 'none' ? undefined : newTableForm.waiter,
						restaurantId
					}),
				}
			);
			if (!res.ok) throw new Error('Failed to add table');
			await fetchTables();
			setShowAddTableDialog(false);
			setNewTableForm({ number: '', capacity: '4', waiter: 'none' });
		} catch (error) { toast.error('Error adding table'); }
	};

	const handleDeleteTable = async (tableId) => {
		setIsDeleting(tableId);
		try {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/table/${tableId}`,
				{ method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
			);
			if (!res.ok) throw new Error('Failed to delete table');
			setTables((prev) => prev.filter((t) => t.id !== tableId));
		} catch (error) { toast.error('Error deleting table'); }
		finally { setIsDeleting(null); }
	};

	const updateTableData = async (tableId, data) => {
		try {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/table/${tableId}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
					body: JSON.stringify(data),
				}
			);
			if (!res.ok) throw new Error('Failed to update table');
			await fetchTables();
		} catch (error) { toast.error('Error updating table'); }
	};

	const handleTableAction = (table: any, action: string) => {
		if (action === 'start-order' || action === 'resume-order') {
			// Navigate to POS
			onNavigate('pos');
		} else if (action === 'checkout') {
			setCheckoutTable(table);
			setCustomerPhone('');
			setDiscount(0);
			setPaymentMethod('cash');
			setCheckoutRemarks('');
			setShowCheckoutDialog(true);
		}
	};

	const calculateTotal = (orderAmount: number, discountPercent: number) => {
		const discountAmount = (orderAmount * discountPercent) / 100;
		const subtotal = orderAmount - discountAmount;
		const gst = subtotal * 0.18;
		return subtotal + gst;
	};
	// Filtering
	const filteredTables = tables.filter((table) => {
    const numberString = table.tableNumber != null ? table.tableNumber.toString() : '';
    const customerString = table.customer ? table.customer.toLowerCase() : '';
    const waiterString = table.waiter ? table.waiter.toLowerCase() : '';

    const matchesSearch =
      numberString.includes(searchTerm) ||
      customerString.includes(searchTerm.toLowerCase()) ||
      waiterString.includes(searchTerm.toLowerCase());

    const status = table.status ? table.status.toLowerCase() : '';
    const filterStatus = statusFilter.toLowerCase();

    const matchesStatus = statusFilter === 'all' || status === filterStatus;

    return matchesSearch && matchesStatus;
  });


	const handleCheckout = async (action: 'print' | 'whatsapp' | 'save') => {
		if (!checkoutTable) return;

		const total = calculateTotal(checkoutTable.orderAmount || 0, discount);

		const checkoutSummary = {
			tableNumber: checkouttable.tableNumber,
			customer: checkoutTable.customer,
			orderAmount: checkoutTable.orderAmount,
			discount,
			total,
			paymentMethod,
			remarks: checkoutRemarks,
			timestamp: new Date().toISOString(),
		};

		console.log('Checkout completed:', checkoutSummary);

		try {
			const token = localStorage.getItem('token');
			const res = await fetch(`${import.meta.env.VITE_API_URL}/checkout`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(checkoutSummary),
			});
			if (!res.ok) throw new Error('Failed to save checkout info');
		} catch (error) {
			console.warn('Failed to save checkout data:', error);
		}

		if (action === 'print') {
			alert(
				`Printing invoice...\nPayment: ${paymentMethod.toUpperCase()}\n${
					checkoutRemarks ? `Remarks: ${checkoutRemarks}` : ''
				}`
			);
		} else if (action === 'whatsapp') {
			if (customerPhone) {
				const message = `Hi ${
					checkoutTable.customer
				}, your bill total is ₹${total.toFixed(
					2
				)}. Payment: ${paymentMethod.toUpperCase()}. Thank you for visiting us!`;
				const whatsappUrl = `https://wa.me/91${customerPhone}?text=${encodeURIComponent(
					message
				)}`;
				window.open(whatsappUrl, '_blank');
			} else {
				alert('Please enter customer phone number for WhatsApp');
				return;
			}
		}

		await updateTable(checkoutTable.id, {
			status: 'AVAILABLE',
			customer: '',
			orderAmount: 0,
			timeOccupied: '',
			guests: 0,
		});

		setShowCheckoutDialog(false);
		setCheckoutTable(null);
	};

	

	const stats = {
    total: tables.length,
    occupied: tables.filter((t) => (t.status?.toLowerCase() ?? '') === 'occupied').length,
    AVAILABLE: tables.filter(
      (t) => {
        const s = (t.status ?? '').toLowerCase();
        return s === 'free' || s === 'available';
      }
    ).length,
    reserved: tables.filter((t) => (t.status?.toLowerCase() ?? '') === 'reserved').length,
    revenue: tables.reduce((sum, t) => sum + (t.orderAmount ?? 0), 0),
  };

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'occupied':
				return '🔴';
      case "AVAILABLE":
				return '🟢';
			case 'reserved':
				return '🟡';
			default:
				return '⚪';
		}
  };
  const getStatusColor = (status: string) => {
		switch (status) {
			case 'occupied':
				return 'bg-red-100 border-red-200 text-red-800';
      case 'AVAILABLE':
				return 'bg-green-100 border-green-200 text-green-800';
			case 'reserved':
				return 'bg-yellow-100 border-yellow-200 text-yellow-800';
			default:
				return 'bg-gray-100 border-gray-200 text-gray-800';
		}
	};

	return (
		<div className='p-4 space-y-6'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
				<div>
					<h1 className='text-2xl font-bold text-primary'>Table Management</h1>
					<p className='text-muted-foreground'>
						Manage table status and customer flow
					</p>
				</div>
				<div className='flex gap-2'>
					<Select
						value={viewMode}
						onValueChange={(value: 'compact' | 'detailed') =>
							setViewMode(value)
						}>
						<SelectTrigger className='w-32'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='compact'>Compact</SelectItem>
							<SelectItem value='detailed'>Detailed</SelectItem>
						</SelectContent>
					</Select>
					<Button
						size='sm'
						onClick={() => setShowAddTableDialog(true)}>
						<Plus className='w-4 h-4 mr-2' />
						Add Table
					</Button>
				</div>
			</div>

			{/* Search and Filter Bar */}
			<div className='flex flex-col sm:flex-row gap-4'>
				<div className='relative flex-1'>
					<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
					<Input
						placeholder='Search tables, customers, or waiters...'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className='pl-10'
					/>
				</div>
				<Select
					value={statusFilter}
					onValueChange={setStatusFilter}>
					<SelectTrigger className='w-full sm:w-48'>
						<SelectValue placeholder='Filter by status' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>All Tables</SelectItem>
						<SelectItem value='AVAILABLE'>🟢 Available</SelectItem>
						<SelectItem value='occupied'>🔴 Occupied</SelectItem>
						<SelectItem value='reserved'>🟡 Reserved</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Table Density Info */}
			{filteredTables.length > 20 && (
				<div className='text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border'>
					<div className='flex items-center justify-between'>
						<span>
							Displaying {filteredTables.length} tables in {viewMode} view
							{filteredTables.length > 30 && ' • Optimized for high density'}
						</span>
						<Badge
							variant='outline'
							className='text-xs'>
							{viewMode === 'compact' ? 'Space Efficient' : 'Detailed View'}
						</Badge>
					</div>
				</div>
			)}

			{/* Stats Cards */}
			<div className='grid grid-cols-2 sm:grid-cols-5 gap-4'>
				<Card className='p-4'>
					<div className='text-center'>
						<div className='text-2xl font-bold text-primary'>{stats.total}</div>
						<div className='text-sm text-muted-foreground'>Total Tables</div>
					</div>
				</Card>
				<Card className='p-4'>
					<div className='text-center'>
						<div className='text-2xl font-bold text-red-600'>
							{stats.occupied}
						</div>
						<div className='text-sm text-muted-foreground'>Occupied</div>
					</div>
				</Card>
				<Card className='p-4'>
					<div className='text-center'>
						<div className='text-2xl font-bold text-green-600'>
							{stats.AVAILABLE}
						</div>
						<div className='text-sm text-muted-foreground'>Available</div>
					</div>
				</Card>
				<Card className='p-4'>
					<div className='text-center'>
						<div className='text-2xl font-bold text-yellow-600'>
							{stats.reserved}
						</div>
						<div className='text-sm text-muted-foreground'>Reserved</div>
					</div>
				</Card>

				<Card className='p-4'>
					<div className='text-center'>
						<div className='text-2xl font-bold text-primary'>
							₹{stats.revenue}
						</div>
						<div className='text-sm text-muted-foreground'>Revenue</div>
					</div>
				</Card>
			</div>

			{/* Cleaning Tasks Summary (if any) */}

			{/* Quick Actions */}
			<div className='flex flex-wrap gap-2'>
				<Button
					variant='outline'
					size='sm'
					onClick={() => setStatusFilter('occupied')}>
					<UserCheck className='w-4 h-4 mr-2' />
					Show Occupied ({stats.occupied})
				</Button>
				<Button
					variant='outline'
					size='sm'
					onClick={() => setStatusFilter('AVAILABLE')}>
					<Coffee className='w-4 h-4 mr-2' />
					Show Available ({stats.AVAILABLE})
				</Button>
				<Button
					variant='outline'
					size='sm'
					onClick={() => setStatusFilter('reserved')}>
					<Clock className='w-4 h-4 mr-2' />
					Show Reserved ({stats.reserved})
				</Button>
				<Button
					variant='outline'
					size='sm'
					onClick={() => setStatusFilter('all')}>
					<Users className='w-4 h-4 mr-2' />
					Show All ({stats.total})
				</Button>
			</div>

			{/* Table Grid Container with optimized scrolling */}
			<div
				className={
					filteredTables.length > 50 ? 'max-h-[70vh] overflow-y-auto pr-2' : ''
				}>
				<div
					className={`grid gap-2 sm:gap-3 ${
						viewMode === 'compact'
							? filteredTables.length <= 15
								? 'grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8'
								: filteredTables.length <= 30
								? 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12'
								: filteredTables.length <= 45
								? 'grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-15 2xl:grid-cols-18'
								: 'grid-cols-6 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-15 xl:grid-cols-18 2xl:grid-cols-20'
							: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
					}`}>
					{filteredTables.map((table) => (
						<Dialog key={table.id}>
							<DialogTrigger asChild>
								<Card
									className={`cursor-pointer transition-all hover:shadow-md ${getStatusColor(
										table.status
									)} border-2 ${
										viewMode === 'compact'
											? 'min-h-[80px] sm:min-h-[90px]'
											: 'min-h-[120px] sm:min-h-[140px]'
									}`}>
									<CardContent
										className={
											viewMode === 'compact' ? 'p-1.5 sm:p-2' : 'p-3 sm:p-4'
										}>
										<div className='text-center space-y-1'>
											<div
												className={
													viewMode === 'compact'
														? 'text-sm sm:text-base'
														: 'text-2xl sm:text-3xl'
												}>
												{getStatusIcon(table.status)}
											</div>
											<div
												className={`font-bold ${
													viewMode === 'compact'
														? 'text-xs sm:text-sm'
														: 'text-sm sm:text-lg'
												}`}>
												{viewMode === 'compact'
													? `T${table.tableNumber}`
													: `Table ${table.tableNumber}`}
											</div>
											<div className='text-xs opacity-75'>
												{viewMode === 'compact'
													? `${table.capacity}p`
													: `${table.capacity} seats`}
											</div>

											{table.status === 'occupied' && (
												<div className='space-y-0.5'>
													<div
														className={`font-medium truncate ${
															viewMode === 'compact' ? 'text-xs' : 'text-sm'
														}`}>
														{viewMode === 'compact'
															? table.customer?.split(' ')[0]
															: table.customer}
													</div>
													{viewMode === 'detailed' && (
														<div className='text-xs opacity-75'>
															{table.timeOccupied}
														</div>
													)}
													<div
														className={`font-bold ${
															viewMode === 'compact' ? 'text-xs' : 'text-sm'
														}`}>
														₹{table.orderAmount}
													</div>
												</div>
											)}

											{table.status === 'reserved' && (
												<div className='space-y-0.5'>
													<div
														className={`font-medium truncate ${
															viewMode === 'compact' ? 'text-xs' : 'text-sm'
														}`}>
														{viewMode === 'compact'
															? table.customer?.split(' ')[0]
															: table.customer}
													</div>
													<div className='text-xs opacity-75'>
														{viewMode === 'compact'
															? `${table.guests}g`
															: `${table.guests} guests`}
													</div>
												</div>
											)}

											{table.status === 'AVAILABLE' && (
												<Badge
													variant='outline'
													className='text-xs px-1 py-0'>
													{viewMode === 'compact' ? 'Free' : 'Available'}
												</Badge>
											)}
										</div>
									</CardContent>
								</Card>
							</DialogTrigger>

							<DialogContent>
								<DialogHeader>
									<DialogTitle className='flex items-center justify-between'>
										<span>
											Table {table.tableNumber} -{' '}
											{table.status.charAt(0).toUpperCase() +
												table.status.slice(1)}
										</span>
										<Button
											variant='outline'
											size='sm'
											onClick={() => handleDeleteTable(table.id)}
											className='text-destructive hover:text-destructive'>
											<Trash2 size={14} />
										</Button>
									</DialogTitle>
									<DialogDescription>
										Manage table settings, customer details, and table status
									</DialogDescription>
								</DialogHeader>

								<div className='space-y-4'>
									<div className='grid grid-cols-2 gap-4'>
										<div>
											<Label htmlFor='capacity'>Capacity</Label>
											<Input
												id='capacity'
												value={table.capacity}
												readOnly
											/>
										</div>
										<div>
											<Label htmlFor='waiter'>Assigned Waiter</Label>
											<Select defaultValue={table.waiter || 'none'}>
												<SelectTrigger>
													<SelectValue placeholder='Select waiter' />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='none'>No assignment</SelectItem>
													<SelectItem value='Raj'>Raj</SelectItem>
													<SelectItem value='Priya'>Priya</SelectItem>
													<SelectItem value='Amit'>Amit</SelectItem>
													<SelectItem value='Sunita'>Sunita</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>

									<div>
										<Label htmlFor='customer'>Customer Name</Label>
										<Input
											id='customer'
											defaultValue={table.customer}
											placeholder='Enter customer name'
										/>
									</div>

									<div>
										<Label htmlFor='guests'>Number of Guests</Label>
										<Input
											id='guests'
											type='number'
											defaultValue={table.guests}
											placeholder='Enter number of guests'
										/>
									</div>

									{table.status === 'occupied' && (
										<div className='bg-accent/50 p-4 rounded-lg'>
											<div className='flex items-center gap-2 mb-2'>
												<Clock className='w-4 h-4' />
												<span className='font-medium'>Order Details</span>
											</div>
											<div className='grid grid-cols-2 gap-4 text-sm'>
												<div>Duration: {table.timeOccupied}</div>
												<div>Amount: ₹{table.orderAmount}</div>
											</div>
										</div>
									)}

									{table.status === 'cleaning' && (
										<div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
											<div className='flex items-center gap-2 mb-2'>
												<Badge className='bg-blue-600'>
													🧹 Cleaning in Progress
												</Badge>
											</div>
											<div className='grid grid-cols-2 gap-4 text-sm'>
												<div>
													<span className='font-medium'>Assigned to:</span>
													<div className='flex items-center gap-1 mt-1'>
														👤 {table.cleaningAssignedTo || 'Unassigned'}
													</div>
												</div>
												<div>
													<span className='font-medium'>Time:</span>
													<div className='flex items-center gap-1 mt-1'>
														⏱️ {table.cleaningEstimatedTime || 15} min
													</div>
												</div>
												<div className='col-span-2'>
													<span className='font-medium'>Started:</span>
													<div className='text-muted-foreground mt-1'>
														{table.cleaningStartTime || 'Just now'}
													</div>
												</div>
												{table.cleaningNotes && (
													<div className='col-span-2'>
														<span className='font-medium'>Notes:</span>
														<div className='text-muted-foreground mt-1 bg-white p-2 rounded border'>
															{table.cleaningNotes}
														</div>
													</div>
												)}
											</div>
										</div>
									)}

									<div className='flex gap-2 pt-4'>
										{table.status === 'AVAILABLE' && (
											<Button
												className='flex-1'
												onClick={() => handleTableAction(table, 'start-order')}>
												<Coffee className='w-4 h-4 mr-2' />
												Start Order
											</Button>
										)}

										{table.status === 'occupied' && (
											<>
												<Button
													className='flex-1'
													onClick={() =>
														handleTableAction(table, 'resume-order')
													}>
													<Coffee className='w-4 h-4 mr-2' />
													Resume Order
												</Button>
												<Button
													variant='outline'
													className='flex-1'
													onClick={() => handleTableAction(table, 'checkout')}>
													<UserCheck className='w-4 h-4 mr-2' />
													Checkout
												</Button>
											</>
										)}

										{table.status === 'reserved' && (
											<Button
												className='flex-1'
												onClick={() => handleTableAction(table, 'start-order')}>
												<Users className='w-4 h-4 mr-2' />
												Seat Guests
											</Button>
										)}
									</div>
								</div>
							</DialogContent>
						</Dialog>
					))}
				</div>
			</div>

			{/* Add Table Dialog */}
			<Dialog
				open={showAddTableDialog}
				onOpenChange={setShowAddTableDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add New Table</DialogTitle>
						<DialogDescription>
							Create a new table in your restaurant layout
						</DialogDescription>
					</DialogHeader>
					<div className='space-y-4'>
						<div>
							<Label htmlFor='tableNumber'>Table Number</Label>
							<Input
								id='tableNumber'
								type='number'
								placeholder='Enter table number'
								value={newTableForm.number}
								onChange={(e) =>
									setNewTableForm((prev) => ({
										...prev,
										number: e.target.value,
									}))
								}
							/>
						</div>

						<div>
							<Label htmlFor='tableCapacity'>Capacity</Label>
							<Select
								value={newTableForm.capacity}
								onValueChange={(value) =>
									setNewTableForm((prev) => ({ ...prev, capacity: value }))
								}>
								<SelectTrigger>
									<SelectValue placeholder='Select capacity' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='2'>2 seats</SelectItem>
									<SelectItem value='4'>4 seats</SelectItem>
									<SelectItem value='6'>6 seats</SelectItem>
									<SelectItem value='8'>8 seats</SelectItem>
									<SelectItem value='10'>10 seats</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label htmlFor='assignedWaiter'>Assigned Waiter (Optional)</Label>
							<Select
								value={newTableForm.waiter}
								onValueChange={(value) =>
									setNewTableForm((prev) => ({ ...prev, waiter: value }))
								}>
								<SelectTrigger>
									<SelectValue placeholder='Select waiter' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='none'>No assignment</SelectItem>
									<SelectItem value='Raj'>Raj</SelectItem>
									<SelectItem value='Priya'>Priya</SelectItem>
									<SelectItem value='Amit'>Amit</SelectItem>
									<SelectItem value='Sunita'>Sunita</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className='flex gap-2 pt-4'>
							<Button
								variant='outline'
								onClick={() => setShowAddTableDialog(false)}
								className='flex-1'>
								Cancel
							</Button>
							<Button
								onClick={handleAddTable}
								disabled={!newTableForm.number || !newTableForm.capacity}
								className='flex-1'>
								Add Table
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Checkout Dialog */}
			<Dialog
				open={showCheckoutDialog}
				onOpenChange={setShowCheckoutDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Checkout - Table {checkoutTable?.number}</DialogTitle>
						<DialogDescription>
							Complete the order and generate invoice for the customer
						</DialogDescription>
					</DialogHeader>
					<div className='space-y-4'>
						<div className='bg-muted/50 p-4 rounded-lg'>
							<h4 className='font-medium mb-2'>Order Summary</h4>
							<div className='space-y-2 text-sm'>
								<div className='flex justify-between'>
									<span>Customer:</span>
									<span>{checkoutTable?.customer}</span>
								</div>
								<div className='flex justify-between'>
									<span>Duration:</span>
									<span>{checkoutTable?.timeOccupied}</span>
								</div>
								<div className='flex justify-between'>
									<span>Order Amount:</span>
									<span>₹{checkoutTable?.orderAmount}</span>
								</div>
							</div>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='discount'>Discount (%)</Label>
							<div className='flex gap-2'>
								<Input
									id='discount'
									type='number'
									min='0'
									max='100'
									placeholder='Enter discount percentage'
									value={discount}
									onChange={(e) => setDiscount(Number(e.target.value))}
								/>
								<Button
									variant='outline'
									size='sm'>
									<Percent className='w-4 h-4' />
								</Button>
							</div>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='customerPhone'>
								Customer Phone (for WhatsApp)
							</Label>
							<Input
								id='customerPhone'
								type='tel'
								placeholder='Enter phone number'
								value={customerPhone}
								onChange={(e) => setCustomerPhone(e.target.value)}
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='paymentMethod'>Payment Method</Label>
							<Select
								value={paymentMethod}
								onValueChange={setPaymentMethod}>
								<SelectTrigger>
									<SelectValue placeholder='Select payment method' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='cash'>
										<div className='flex items-center gap-2'>
											<Banknote className='w-4 h-4' />
											Cash
										</div>
									</SelectItem>
									<SelectItem value='card'>
										<div className='flex items-center gap-2'>
											<CreditCard className='w-4 h-4' />
											Card
										</div>
									</SelectItem>
									<SelectItem value='upi'>
										<div className='flex items-center gap-2'>
											<Smartphone className='w-4 h-4' />
											UPI/Online
										</div>
									</SelectItem>
									<SelectItem value='mixed'>
										<div className='flex items-center gap-2'>
											<Receipt className='w-4 h-4' />
											Mixed Payment
										</div>
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='checkoutRemarks'>Remarks/Notes</Label>
							<Textarea
								id='checkoutRemarks'
								placeholder='Add any remarks (e.g., paid via cash, customer feedback, special instructions...)'
								value={checkoutRemarks}
								onChange={(e) => setCheckoutRemarks(e.target.value)}
								rows={3}
								className='resize-none'
							/>
						</div>

						{checkoutTable && (
							<div className='bg-primary/5 p-4 rounded-lg'>
								<h4 className='font-medium mb-2'>Bill Total</h4>
								<div className='space-y-1 text-sm'>
									<div className='flex justify-between'>
										<span>Order Amount:</span>
										<span>₹{checkoutTable.orderAmount}</span>
									</div>
									<div className='flex justify-between'>
										<span>Discount ({discount}%):</span>
										<span>
											-₹
											{(
												((checkoutTable.orderAmount || 0) * discount) /
												100
											).toFixed(2)}
										</span>
									</div>
									<div className='flex justify-between'>
										<span>Subtotal:</span>
										<span>
											₹
											{(
												(checkoutTable.orderAmount || 0) -
												((checkoutTable.orderAmount || 0) * discount) / 100
											).toFixed(2)}
										</span>
									</div>
									<div className='flex justify-between'>
										<span>GST (18%):</span>
										<span>
											₹
											{(
												((checkoutTable.orderAmount || 0) -
													((checkoutTable.orderAmount || 0) * discount) / 100) *
												0.18
											).toFixed(2)}
										</span>
									</div>
									<Separator />
									<div className='flex justify-between font-bold text-primary'>
										<span>Final Total:</span>
										<span>
											₹
											{calculateTotal(
												checkoutTable.orderAmount || 0,
												discount
											).toFixed(2)}
										</span>
									</div>
									<Separator />
									<div className='flex justify-between text-accent-foreground'>
										<span>Payment Method:</span>
										<span className='font-medium capitalize'>
											{paymentMethod === 'upi' ? 'UPI/Online' : paymentMethod}
										</span>
									</div>
									{checkoutRemarks && (
										<div className='pt-2'>
											<span className='text-xs text-muted-foreground'>
												Remarks:
											</span>
											<p className='text-sm bg-muted/50 p-2 rounded mt-1'>
												{checkoutRemarks}
											</p>
										</div>
									)}
								</div>
							</div>
						)}

						<div className='space-y-3 pt-4'>
							<div className='grid grid-cols-2 gap-2'>
								<Button
									className='h-12 gap-2'
									onClick={() => handleCheckout('print')}>
									<Printer size={18} />
									Print Bill
								</Button>

								<Button
									variant='outline'
									className='h-12 gap-2'
									onClick={() => handleCheckout('whatsapp')}
									disabled={!customerPhone}>
									<MessageCircle size={18} />
									WhatsApp
								</Button>
							</div>

							<Button
								variant='outline'
								className='w-full h-12 gap-2 bg-green-50 border-green-200 hover:bg-green-100 text-green-700'
								onClick={() => handleCheckout('save')}>
								<UserCheck size={18} />
								Complete Checkout & Clear Table
							</Button>

							<div className='text-xs text-muted-foreground text-center'>
								💡 Payment method and remarks will be saved with the transaction
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}

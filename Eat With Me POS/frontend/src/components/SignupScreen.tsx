/** @format */

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from './ui/dialog';
import { useAppContext, countryCurrencyMap } from '../contexts/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import {
	Building2,
	Phone,
	Mail,
	User,
	MapPin,
	Check,
	Crown,
	Star,
	Zap,
	Globe,
	ArrowRight,
	ArrowLeft,
	Bot,
	Sparkles,
	Shield,
	Wifi,
	BarChart3,
	Users,
	TrendingUp,
} from 'lucide-react';

interface SignupScreenProps {
	onSignup: () => void;
	onBackToLogin: () => void;
}

export function SignupScreen({ onSignup, onBackToLogin }: SignupScreenProps) {
	const { updateSettings } = useAppContext();
	const [step, setStep] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		restaurantName: '',
		ownerName: '',
		email: '',
		password: '',
		confirmPassword: '',
		phone: '',
		address: '',
		country: 'India',
		selectedPlan: '',
	});

	const countries = Object.keys(countryCurrencyMap);

	const plans = [
		{
			id: 'starter',
			name: 'Starter',
			price: 'Free',
			period: 'Forever',
			description: 'Perfect for small cafes and food trucks',
			features: [
				'Up to 50 orders per day',
				'Basic POS system',
				'Menu management',
				'Simple reporting',
				'Email support',
			],
			icon: Star,
			color: 'from-green-500 to-emerald-500',
			popular: false,
		},
		{
			id: 'professional',
			name: 'Professional',
			price: '$29',
			period: 'per month',
			description: 'AI-powered features for growing restaurants',
			features: [
				'Unlimited orders',
				'Full AI insights & analytics',
				'Advanced inventory management',
				'Staff management system',
				'WhatsApp integration',
				'Multi-device sync',
				'Priority support',
			],
			icon: Zap,
			color: 'from-purple-500 to-pink-500',
			popular: true,
		},
		{
			id: 'enterprise',
			name: 'Enterprise',
			price: '$99',
			period: 'per month',
			description: 'Complete solution for restaurant chains',
			features: [
				'Everything in Professional',
				'Multi-location management',
				'Custom AI training',
				'API access',
				'White-label options',
				'Dedicated account manager',
				'24/7 phone support',
			],
			icon: Crown,
			color: 'from-blue-500 to-cyan-500',
			popular: false,
		},
	];

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleCountryChange = (country: string) => {
		handleInputChange('country', country);
	};

	const handlePlanSelect = (planId: string) => {
		handleInputChange('selectedPlan', planId);
	};

	const handleNext = () => {
		if (step < 3) {
			setStep(step + 1);
		}
	};

	const handleBack = () => {
		if (step > 1) {
			setStep(step - 1);
		}
	};

	// const handleFinish = async () => {
	//   setIsLoading(true);

	//   // Update app settings with restaurant info
	//   updateSettings({
	//     restaurantName: formData.restaurantName,
	//     country: formData.country,
	//     currency: countryCurrencyMap[formData.country].currency,
	//     currencySymbol: countryCurrencyMap[formData.country].symbol,
	//     whatsappApiKey: '',
	//     whatsappPhoneNumber: ''
	//   });

	//   // Simulate API call
	//   await new Promise(resolve => setTimeout(resolve, 2000));
	//   onSignup();
	// };

	const handleFinish = async () => {
		setIsLoading(true);

		try {
			// Prepare payload that matches backend field names
			const payload = {
				restaurantName: formData.restaurantName,
				ownerName: formData.ownerName,
				email: formData.email,
				password: formData.password,
				confirmPassword: formData.confirmPassword,
				phone: formData.phone,
				address: formData.address,
				country: formData.country,
				selectedPlan: formData.selectedPlan,
			};

			// Access environment variable correctly in Vite
			const apiUrl = import.meta.env.VITE_API_URL;
			if (!apiUrl) {
				throw new Error('API URL is not defined in .env file (VITE_API_URL)');
			}

			// ✅ Send signup request
			const response = await fetch(`${apiUrl}/auth/signup`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			// ✅ Parse response safely
			const text = await response.text();
			const data = text ? JSON.parse(text) : {};

			if (!response.ok) {
				throw new Error(data.message || 'Signup failed');
			}

			// ✅ Save JWT token
			if (data.token) {
				localStorage.setItem('token', data.token);
			}

			// ✅ Update context with restaurant settings
			updateSettings({
				restaurantName:
					data.vendor?.restaurant?.[0]?.name || formData.restaurantName,
				country: formData.country,
				currency: countryCurrencyMap[formData.country].currency,
				currencySymbol: countryCurrencyMap[formData.country].symbol,
			});

			onSignup(); // navigate or update UI
		} catch (err: any) {
			console.error('Signup error:', err);
			alert(err.message || 'Signup failed');
		} finally {
			setIsLoading(false);
		}
	};

	const isStepValid = () => {
		switch (step) {
			// return formData.restaurantName && formData.ownerName && formData.email;
			case 1:
				return (
					formData.restaurantName &&
					formData.ownerName &&
					formData.email &&
					formData.password &&
					formData.confirmPassword &&
					formData.password === formData.confirmPassword
				);
			case 2:
				return formData.phone && formData.address && formData.country;
			case 3:
				return formData.selectedPlan;
			default:
				return false;
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden'>
			{/* Animated Background Elements */}
			<div className='absolute inset-0 overflow-hidden'>
				<motion.div
					className='absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70'
					animate={{
						x: [0, 100, 0],
						y: [0, -100, 0],
					}}
					transition={{
						duration: 20,
						repeat: Infinity,
						repeatType: 'reverse',
					}}
				/>
				<motion.div
					className='absolute -bottom-8 -right-4 w-72 h-72 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70'
					animate={{
						x: [0, -100, 0],
						y: [0, 100, 0],
					}}
					transition={{
						duration: 25,
						repeat: Infinity,
						repeatType: 'reverse',
					}}
				/>
			</div>

			<div className='w-full max-w-4xl relative z-10'>
				{/* Header */}
				<motion.div
					className='text-center mb-8'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}>
					<div className='flex items-center gap-4 justify-center mb-4'>
						<motion.div
							className='w-16 h-16 bg-primary rounded-3xl flex items-center justify-center shadow-2xl'
							whileHover={{ scale: 1.1, rotate: 5 }}
							transition={{ type: 'spring', stiffness: 300 }}>
							<span className='text-4xl'>🍽️</span>
						</motion.div>
						<div>
							<h1 className='text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent'>
								Eat With Me
							</h1>
							<p className='text-lg text-muted-foreground flex items-center gap-2 justify-center'>
								<Bot className='w-4 h-4' />
								AI-Powered Restaurant Management
							</p>
						</div>
					</div>

					<h2 className='text-2xl lg:text-3xl font-bold mb-2'>
						Join the Future of Restaurant Management
					</h2>
					<p className='text-muted-foreground max-w-2xl mx-auto'>
						Set up your AI-powered restaurant management system in just 3 simple
						steps
					</p>
				</motion.div>

				{/* Progress Bar */}
				<motion.div
					className='mb-8'
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.2 }}>
					<div className='flex items-center justify-center mb-4'>
						{[1, 2, 3].map((stepNumber) => (
							<div
								key={stepNumber}
								className='flex items-center'>
								<motion.div
									className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm ${
										step >= stepNumber
											? 'bg-primary text-white'
											: 'bg-muted text-muted-foreground'
									}`}
									whileHover={{ scale: 1.1 }}
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ delay: stepNumber * 0.1 }}>
									{step > stepNumber ? (
										<Check className='w-5 h-5' />
									) : (
										stepNumber
									)}
								</motion.div>
								{stepNumber < 3 && (
									<div
										className={`w-16 h-1 mx-2 rounded ${
											step > stepNumber ? 'bg-primary' : 'bg-muted'
										}`}
									/>
								)}
							</div>
						))}
					</div>
					<div className='flex justify-center gap-8 text-sm'>
						<span
							className={
								step >= 1 ? 'text-primary font-medium' : 'text-muted-foreground'
							}>
							Restaurant Info
						</span>
						<span
							className={
								step >= 2 ? 'text-primary font-medium' : 'text-muted-foreground'
							}>
							Location & Contact
						</span>
						<span
							className={
								step >= 3 ? 'text-primary font-medium' : 'text-muted-foreground'
							}>
							Choose Plan
						</span>
					</div>
				</motion.div>

				{/* Form Content */}
				<AnimatePresence mode='wait'>
					<motion.div
						key={step}
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -50 }}
						transition={{ duration: 0.3 }}>
						<Card className='backdrop-blur-sm bg-white/95 border-0 shadow-2xl max-w-2xl mx-auto'>
							<CardHeader className='text-center pb-6'>
								<CardTitle className='text-xl'>
									{step === 1 && 'Tell us about your restaurant'}
									{step === 2 && 'Where are you located?'}
									{step === 3 && 'Choose your AI plan'}
								</CardTitle>
								<CardDescription>
									{step === 1 && 'Basic information to get you started'}
									{step === 2 && 'Help us customize your experience'}
									{step === 3 && 'Select the plan that fits your needs'}
								</CardDescription>
							</CardHeader>

							<CardContent className='space-y-6'>
								{/* Step 1: Restaurant Info */}
								{step === 1 && (
									<motion.div
										className='space-y-4'
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.2 }}>
										<div className='space-y-2'>
											<label className='text-sm font-medium'>
												Restaurant Name
											</label>
											<div className='relative'>
												<Building2 className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
												<Input
													placeholder='Your Restaurant Name'
													value={formData.restaurantName}
													onChange={(e) =>
														handleInputChange('restaurantName', e.target.value)
													}
													className='pl-10 h-12 bg-white/50 border-primary/20 focus:border-primary'
												/>
											</div>
										</div>

										<div className='space-y-2'>
											<label className='text-sm font-medium'>
												Owner/Manager Name
											</label>
											<div className='relative'>
												<User className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
												<Input
													placeholder='Your Full Name'
													value={formData.ownerName}
													onChange={(e) =>
														handleInputChange('ownerName', e.target.value)
													}
													className='pl-10 h-12 bg-white/50 border-primary/20 focus:border-primary'
												/>
											</div>
										</div>

										<div className='space-y-2'>
											<label className='text-sm font-medium'>
												Email Address
											</label>
											<div className='relative'>
												<Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
												<Input
													type='email'
													placeholder='your@email.com'
													value={formData.email}
													onChange={(e) =>
														handleInputChange('email', e.target.value)
													}
													className='pl-10 h-12 bg-white/50 border-primary/20 focus:border-primary'
												/>
											</div>
										</div>
										<div className='space-y-2'>
											<label className='text-sm font-medium'>Password</label>
											<div className='relative'>
												<Input
													type='password'
													placeholder='Enter your password'
													value={formData.password}
													onChange={(e) =>
														handleInputChange('password', e.target.value)
													}
													className='pl-10 h-12 bg-white/50 border-primary/20 focus:border-primary'
												/>
											</div>
										</div>
										<div className='space-y-2'>
											<label className='text-sm font-medium'>
												Confirm Password
											</label>
											<div className='relative'>
												<Input
													type='password'
													placeholder='Re-Enter your password'
													value={formData.confirmPassword}
													onChange={(e) =>
														handleInputChange('confirmPassword', e.target.value)
													}
													className='pl-10 h-12 bg-white/50 border-primary/20 focus:border-primary'
												/>
											</div>
										</div>
									</motion.div>
								)}

								{/* Step 2: Location & Contact */}
								{step === 2 && (
									<motion.div
										className='space-y-4'
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.2 }}>
										<div className='space-y-2'>
											<label className='text-sm font-medium'>
												Phone Number
											</label>
											<div className='relative'>
												<Phone className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
												<Input
													placeholder='+1 (555) 000-0000'
													value={formData.phone}
													onChange={(e) =>
														handleInputChange('phone', e.target.value)
													}
													className='pl-10 h-12 bg-white/50 border-primary/20 focus:border-primary'
												/>
											</div>
										</div>

										<div className='space-y-2'>
											<label className='text-sm font-medium'>
												Restaurant Address
											</label>
											<div className='relative'>
												<MapPin className='absolute left-3 top-3 w-4 h-4 text-muted-foreground' />
												<textarea
													placeholder='Full restaurant address'
													value={formData.address}
													onChange={(e) =>
														handleInputChange('address', e.target.value)
													}
													className='w-full pl-10 pt-3 pb-3 pr-3 min-h-[80px] bg-white/50 border border-primary/20 focus:border-primary rounded-lg resize-none'
												/>
											</div>
										</div>

										<div className='space-y-2'>
											<label className='text-sm font-medium'>Country</label>
											<Select
												value={formData.country}
												onValueChange={handleCountryChange}>
												<SelectTrigger className='h-12 bg-white/50 border-primary/20 focus:border-primary'>
													<div className='flex items-center gap-2'>
														<Globe className='w-4 h-4 text-muted-foreground' />
														<SelectValue />
													</div>
												</SelectTrigger>
												<SelectContent>
													{countries.map((country) => (
														<SelectItem
															key={country}
															value={country}>
															{country} ({countryCurrencyMap[country].symbol})
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</motion.div>
								)}

								{/* Step 3: Plan Selection */}
								{step === 3 && (
									<motion.div
										className='space-y-6'
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.2 }}>
										<div className='grid gap-4'>
											{plans.map((plan) => (
												<motion.div
													key={plan.id}
													className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
														formData.selectedPlan === plan.id
															? 'border-primary bg-primary/5'
															: 'border-border hover:border-primary/50'
													}`}
													onClick={() => handlePlanSelect(plan.id)}
													whileHover={{ scale: 1.02 }}
													whileTap={{ scale: 0.98 }}>
													{plan.popular && (
														<Badge className='absolute -top-2 left-6 bg-gradient-to-r from-purple-500 to-pink-500'>
															Most Popular
														</Badge>
													)}

													<div className='flex items-start gap-4'>
														<div
															className={`w-12 h-12 rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
															{(() => {
																const IconComponent = plan.icon;
																return (
																	<IconComponent className='w-6 h-6 text-white' />
																);
															})()}
														</div>

														<div className='flex-1'>
															<div className='flex items-center gap-2 mb-2'>
																<h3 className='font-semibold text-lg'>
																	{plan.name}
																</h3>
																<div className='text-right'>
																	<p className='font-bold text-xl'>
																		{plan.price}
																	</p>
																	<p className='text-xs text-muted-foreground'>
																		{plan.period}
																	</p>
																</div>
															</div>

															<p className='text-muted-foreground text-sm mb-3'>
																{plan.description}
															</p>

															<div className='grid grid-cols-1 gap-1'>
																{plan.features.map((feature, index) => (
																	<div
																		key={index}
																		className='flex items-center gap-2 text-sm'>
																		<Check className='w-3 h-3 text-green-500' />
																		<span>{feature}</span>
																	</div>
																))}
															</div>
														</div>

														{formData.selectedPlan === plan.id && (
															<motion.div
																initial={{ scale: 0 }}
																animate={{ scale: 1 }}
																className='w-6 h-6 bg-primary rounded-full flex items-center justify-center'>
																<Check className='w-4 h-4 text-white' />
															</motion.div>
														)}
													</div>
												</motion.div>
											))}
										</div>
									</motion.div>
								)}

								{/* Navigation Buttons */}
								<div className='flex justify-between pt-6 border-t'>
									<Button
										variant='ghost'
										onClick={step === 1 ? onBackToLogin : handleBack}
										className='flex items-center gap-2'>
										<ArrowLeft className='w-4 h-4' />
										{step === 1 ? 'Back to Login' : 'Previous'}
									</Button>

									{step < 3 ? (
										<Button
											onClick={handleNext}
											disabled={!isStepValid()}
											className='flex items-center gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90'>
											Next
											<ArrowRight className='w-4 h-4' />
										</Button>
									) : (
										<Button
											onClick={handleFinish}
											disabled={!isStepValid() || isLoading}
											className='flex items-center gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90'>
											{isLoading ? (
												<>
													<motion.div
														className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full'
														animate={{ rotate: 360 }}
														transition={{
															duration: 1,
															repeat: Infinity,
															ease: 'linear',
														}}
													/>
													Setting up AI...
												</>
											) : (
												<>
													<Sparkles className='w-4 h-4' />
													Start with AI
												</>
											)}
										</Button>
									)}
								</div>

								{/* Trust Indicators */}
								<div className='flex items-center justify-center gap-6 pt-4 border-t'>
									<div className='flex items-center gap-1 text-xs text-muted-foreground'>
										<Shield className='w-3 h-3' />
										Bank-grade Security
									</div>
									<div className='flex items-center gap-1 text-xs text-muted-foreground'>
										<Wifi className='w-3 h-3' />
										Cloud Backup
									</div>
									<div className='flex items-center gap-1 text-xs text-muted-foreground'>
										<Bot className='w-3 h-3' />
										AI-Powered
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
}

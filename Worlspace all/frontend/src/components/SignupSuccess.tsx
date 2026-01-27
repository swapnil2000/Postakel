import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  CheckCircle,
  Copy,
  Mail,
  Lock,
  Shield,
  ArrowRight,
  Download,
} from 'lucide-react';

interface SignupSuccessProps {
  companyName: string;
  email: string;
  companyId: string;
  plan: string;
  onContinue: () => void;
}

export function SignupSuccess({ 
  companyName, 
  email, 
  companyId, 
  plan, 
  onContinue 
}: SignupSuccessProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCompanyId = () => {
    navigator.clipboard.writeText(companyId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCredentials = () => {
    const credentials = `
COMPANY SIGNUP CREDENTIALS
==========================

Company Name: ${companyName}
Email: ${email}
Company ID: ${companyId}
Plan: ${plan}
Status: ACTIVE

IMPORTANT: Save this information securely!
You'll need the Company ID and Email to log in employees to this workspace.

Created on: ${new Date().toLocaleDateString()}
    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(credentials));
    element.setAttribute('download', `${companyName}-credentials.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-teal-400/20 to-emerald-500/20 rounded-full blur-3xl animate-float delay-1000"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-8 min-h-screen flex flex-col justify-center">
        {/* Success Icon */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full blur opacity-75 animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-2xl">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Postakel!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Your workspace has been created successfully
          </p>

          <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 text-lg">
            <Shield className="w-4 h-4 mr-2" />
            Account Active
          </Badge>
        </div>

        {/* Main Card */}
        <Card className="mb-8 border-2 border-emerald-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-200">
            <CardTitle className="text-emerald-900">Your Workspace Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <label className="text-sm text-gray-600 font-semibold">Company Name</label>
                <p className="text-lg text-gray-900 font-bold mt-1">{companyName}</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <label className="text-sm text-gray-600 font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <p className="text-lg text-gray-900 font-bold mt-1">{email}</p>
              </div>

              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <label className="text-sm text-gray-600 font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Plan Type
                </label>
                <p className="text-lg text-gray-900 font-bold mt-1 capitalize">{plan}</p>
              </div>
            </div>

            {/* Company ID - Important */}
            <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border-2 border-amber-300">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-amber-600" />
                <label className="font-bold text-amber-900">Your Company ID</label>
              </div>
              
              <div className="text-center mb-4">
                <p className="text-xs text-amber-700 mb-2 font-semibold">Keep this ID safe - employees will need it to login</p>
                <div className="p-4 bg-white rounded-lg border-2 border-amber-300 font-mono text-xl font-bold text-amber-900 break-all">
                  {companyId}
                </div>
              </div>

              <Button
                onClick={handleCopyCompanyId}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied ? 'Copied to Clipboard!' : 'Copy Company ID'}
              </Button>
            </div>

            {/* Important Notes */}
            <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
              <h3 className="font-bold text-red-900 mb-3">⚠️ Important Security Notes</h3>
              <ul className="space-y-2 text-sm text-red-800">
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  <span>Never share your Company ID with unauthorized people</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  <span>Use this Company ID + Email to invite employees</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  <span>Your account has been created with Admin privileges</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  <span>You can manage team members from the admin dashboard</span>
                </li>
              </ul>
            </div>

            {/* Next Steps */}
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h3 className="font-bold text-emerald-900 mb-3">Next Steps</h3>
              <ol className="space-y-2 text-sm text-emerald-800 list-decimal list-inside">
                <li>Share your Company ID with employees who need to join</li>
                <li>Set up your workspace in the admin dashboard</li>
                <li>Configure teams and departments</li>
                <li>Invite team members to get started</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          <Button
            onClick={handleDownloadCredentials}
            className="w-full h-12 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Credentials
          </Button>

          <Button
            onClick={onContinue}
            className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Continue to Workspace
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm">
          Need help? <a href="#" className="text-emerald-600 hover:text-emerald-700 font-bold">Contact our support team</a>
        </p>
      </div>
    </div>
  );
}

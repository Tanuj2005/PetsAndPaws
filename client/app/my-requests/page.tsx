'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import { Card } from '@/components/ui/card';
import Badge from '@/components/badge';
import { Clock, CheckCircle, XCircle, MessageSquare, X } from 'lucide-react';
import { api, UserAdoptionRequestsResponse } from '@/lib/api';

interface AdoptionRequest {
  id: string;
  pet_name: string;
  message: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
}

const statusConfig = {
  Pending: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
    label: 'Pending'
  },
  Approved: {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
    label: 'Approved'
  },
  Rejected: {
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
    label: 'Rejected'
  }
};

export default function MyAdoptionRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    // Check user type and redirect NGO users
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.user_type === 'NGO') {
        router.push('/ngo');
        return;
      }
    }
    fetchRequests();
  }, [router]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response: UserAdoptionRequestsResponse = await api.getUserAdoptionRequests();
      setRequests(response.requests);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load adoption requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      setCancellingId(requestId);
      await api.cancelAdoptionRequest(requestId);
      // Remove the cancelled request from the list
      setRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel request');
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your adoption requests...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Requests</h2>
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchRequests}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Adoption Requests</h1>
          <p className="text-gray-600">Track the status of your pet adoption applications</p>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Adoption Requests Yet</h2>
              <p className="text-gray-600 mb-6">You haven't submitted any adoption requests. Start browsing available pets to find your perfect companion!</p>
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Pets
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => {
              const statusInfo = statusConfig[request.status];
              const StatusIcon = statusInfo.icon;

              return (
                <Card key={request.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request.pet_name}
                        </h3>
                        <Badge className={`${statusInfo.color} border`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>

                      {request.message && (
                        <div className="mb-3">
                          <p className="text-gray-700 bg-gray-50 rounded-lg p-3 border-l-4 border-blue-200">
                            "{request.message}"
                          </p>
                        </div>
                      )}

                      <div className="text-sm text-gray-500">
                        Submitted on {formatDate(request.created_at)}
                      </div>
                    </div>

                    {request.status === 'Pending' && (
                      <button
                        onClick={() => handleCancelRequest(request.id)}
                        disabled={cancellingId === request.id}
                        className="ml-4 flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancellingId === request.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border border-red-600 border-t-transparent"></div>
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <X className="h-3 w-3" />
                            Cancel
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
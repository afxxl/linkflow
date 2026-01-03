import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Navbar from '../components/Navbar';
import LinkCard from '../components/LinkCard';
import LinkForm from '../components/LinkForm';
import { linkService } from '../services/linkService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingLink, setEditingLink] = useState(null);
    const { user } = useAuth();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        try {
            const response = await linkService.getLinks();
            if (response.success) {
                setLinks(response.data.links);
            }
        } catch (error) {
            toast.error('Failed to fetch links');
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = links.findIndex((link) => link._id === active.id);
            const newIndex = links.findIndex((link) => link._id === over.id);

            const newLinks = arrayMove(links, oldIndex, newIndex);
            setLinks(newLinks);

            // Update positions on server
            try {
                const reorderedLinks = newLinks.map((link, index) => ({
                    id: link._id,
                    position: index,
                }));
                await linkService.reorderLinks(reorderedLinks);
                toast.success('Links reordered');
            } catch (error) {
                toast.error('Failed to reorder links');
                // Revert on error
                fetchLinks();
            }
        }
    };

    const handleCreateLink = async (linkData) => {
        try {
            const response = await linkService.createLink(linkData);
            if (response.success) {
                toast.success('Link created successfully');
                fetchLinks();
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to create link';
            toast.error(message);
            throw error;
        }
    };

    const handleUpdateLink = async (linkData) => {
        try {
            const response = await linkService.updateLink(editingLink._id, linkData);
            if (response.success) {
                toast.success('Link updated successfully');
                fetchLinks();
            }
        } catch (error) {
            toast.error('Failed to update link');
            throw error;
        }
    };

    const handleDeleteLink = async (linkId) => {
        if (!window.confirm('Are you sure you want to delete this link?')) {
            return;
        }

        try {
            const response = await linkService.deleteLink(linkId);
            if (response.success) {
                toast.success('Link deleted successfully');
                fetchLinks();
            }
        } catch (error) {
            toast.error('Failed to delete link');
        }
    };

    const handleToggleLink = async (linkId) => {
        try {
            const response = await linkService.toggleLink(linkId);
            if (response.success) {
                toast.success(response.message);
                fetchLinks();
            }
        } catch (error) {
            toast.error('Failed to toggle link');
        }
    };

    const openCreateForm = () => {
        setEditingLink(null);
        setShowForm(true);
    };

    const openEditForm = (link) => {
        setEditingLink(link);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingLink(null);
    };

    const handleFormSubmit = async (linkData) => {
        if (editingLink) {
            await handleUpdateLink(linkData);
        } else {
            await handleCreateLink(linkData);
        }
    };

    const canAddMoreLinks = user?.plan !== 'free' || links.length < 10;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Links</h1>
                    <p className="mt-2 text-gray-600">
                        Manage your links and automation settings
                    </p>
                </div>

                {/* Add Link Button */}
                <div className="mb-6">
                    <button
                        onClick={openCreateForm}
                        disabled={!canAddMoreLinks}
                        className="w-full sm:w-auto px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add New Link</span>
                    </button>
                    {!canAddMoreLinks && (
                        <p className="mt-2 text-sm text-red-600">
                            Free plan limited to 10 links. Upgrade to add more.
                        </p>
                    )}
                </div>

                {/* Links List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : links.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No links yet</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Get started by creating your first link
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={openCreateForm}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Create Link
                            </button>
                        </div>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={links.map((link) => link._id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-3">
                                {links.map((link) => (
                                    <LinkCard
                                        key={link._id}
                                        link={link}
                                        onEdit={openEditForm}
                                        onDelete={handleDeleteLink}
                                        onToggle={handleToggleLink}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </div>

            {/* Link Form Modal */}
            {showForm && (
                <LinkForm
                    link={editingLink}
                    onSubmit={handleFormSubmit}
                    onClose={closeForm}
                />
            )}
        </div>
    );
};

export default Dashboard;

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const LinkCard = ({ link, onEdit, onDelete, onToggle }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: link._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL || 'http://localhost:3000';
    const redirectUrl = `${PUBLIC_URL}/r/${link._id}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(redirectUrl);
        // You could add a toast notification here
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-white rounded-lg shadow-sm border ${link.isActive ? 'border-gray-200' : 'border-gray-300 bg-gray-50'
                } p-4 hover:shadow-md transition-shadow`}
        >
            <div className="flex items-center space-x-4">
                {/* Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 8h16M4 16h16"
                        />
                    </svg>
                </div>

                {/* Icon */}
                {link.icon && (
                    <div className="text-2xl flex-shrink-0">{link.icon}</div>
                )}

                {/* Link Info */}
                <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-medium ${link.isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                        {link.title}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">{link.url}</p>
                    <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-400">
                            {link.clickCount} clicks
                        </span>
                        {link.schedule?.enabled && (
                            <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                                Scheduled
                            </span>
                        )}
                        {link.geoTargeting?.enabled && (
                            <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">
                                Geo
                            </span>
                        )}
                        {link.deviceTargeting?.enabled && (
                            <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded">
                                Device
                            </span>
                        )}
                        {link.rotation?.enabled && (
                            <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded">
                                A/B Test
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                    <button
                        onClick={copyToClipboard}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        title="Copy link"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </button>

                    <button
                        onClick={() => onToggle(link._id)}
                        className={`p-2 rounded-lg ${link.isActive
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-gray-400 hover:bg-gray-100'
                            }`}
                        title={link.isActive ? 'Active' : 'Inactive'}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>

                    <button
                        onClick={() => onEdit(link)}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                        title="Edit"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>

                    <button
                        onClick={() => onDelete(link._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LinkCard;

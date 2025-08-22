import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import allsvgs from './icons';
// Color scheme constants
const COLORS = {
    primary: '#405DE6',
    secondary: '#5851DB',
    accent: '#833AB4',
    dark: '#262626',
    light: '#f8f8f8',
    gray: '#8e8e8e',
    lightGray: '#dbdbdb',
    white: '#ffffff',
    black: '#000000',
    storyBorder: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)'
};

// Optimized components with memo
const NavItem = React.memo(({ item }) => {
    const [hover, setHover] = useState(false);

    return (
        <Link
            to={item.path || '#'}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={item.onClick}
            className={`flex items-center p-3 rounded-lg transition-colors ${hover ? 'bg-gray-100' : ''}`}
        >
            <span className="w-6 h-6 mr-4 flex items-center justify-center">
                {item.icon}
            </span>
            <span className="text-sm">{item.text}</span>
        </Link>
    );
});

const StoryItem = React.memo(({ story }) => {
    return (
        <Link
            to={`/stories/${story.username}` || '#'}
            className="flex flex-col items-center space-y-1 flex-shrink-0 w-16"
        >
            <div
                className="w-16 h-16 rounded-full p-0.5"
                style={{
                    background: story.hasUnseenStory ? COLORS.storyBorder : COLORS.lightGray
                }}
            >
                <div className="bg-white p-0.5 rounded-full">
                    <img
                        src={story.image}
                        alt={story.username}
                        className="w-full h-full rounded-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/100';
                        }}
                    />
                </div>
            </div>
            <span className="text-xs truncate w-16 text-center">{story.username}</span>
        </Link>
    );
});

const PostItem = React.memo(({ post }) => {
    const [liked, setLiked] = useState(post.liked);
    const [saved, setSaved] = useState(post.saved);
    const [likeAnimation, setLikeAnimation] = useState(false);
    const [commentInput, setCommentInput] = useState('');
    const [showComments, setShowComments] = useState(false);
    const imageRef = useRef(null);

    const handleLike = () => {
        if (!liked) {
            setLikeAnimation(true);
            setTimeout(() => setLikeAnimation(false), 1000);
        }
        setLiked(!liked);
    };

    const handleDoubleClick = () => {
        if (!liked) {
            handleLike();
            setLikeAnimation(true);
            setTimeout(() => setLikeAnimation(false), 1000);
        }
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (commentInput.trim()) {
            // In a real app, you would add the comment to the post
            setCommentInput('');
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg mb-6">
            {/* Post header */}
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center">
                    <Link to={`/${post.username}` || '#'} className="w-8 h-8 rounded-full bg-gray-300 mr-3 overflow-hidden">
                        <img
                            src={`https://source.unsplash.com/random/100x100/?avatar`}
                            alt={post.username}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/100';
                            }}
                        />
                    </Link>
                    <div>
                        <Link to={`/${post.username}` || '#'} className="font-semibold text-sm">{post.username}</Link>
                        <div className="text-xs text-gray-500">{post.location}</div>
                    </div>
                </div>
                <button className="text-gray-500">
                    <MoreOptionsIcon />
                </button>
            </div>

            {/* Post image */}
            <div className="relative w-full aspect-square bg-gray-100">
                <img
                    ref={imageRef}
                    src={post.image}
                    alt={`Post by ${post.username}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onDoubleClick={handleDoubleClick}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/600';
                    }}
                />
                {likeAnimation && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-8xl opacity-80 animate-ping">
                            ❤️
                        </div>
                    </div>
                )}
            </div>

            {/* Post actions */}
            <div className="p-3">
                <div className="flex justify-between mb-2">
                    <div className="flex space-x-4">
                        <button onClick={handleLike} className="focus:outline-none">
                            {liked ? <HeartFilledIcon /> : <HeartIcon />}
                        </button>
                        <button
                            onClick={() => setShowComments(!showComments)}
                            className="text-gray-900"
                        >
                            <CommentIcon />
                        </button>
                        <button className="text-gray-900">
                            <ShareIcon />
                        </button>
                    </div>
                    <button onClick={() => setSaved(!saved)} className="text-gray-900">
                        {saved ? <BookmarkFilledIcon /> : <BookmarkIcon />}
                    </button>
                </div>

                <div className="font-semibold text-sm mb-1">
                    {(post.likes + (liked ? 1 : 0)).toLocaleString()} likes
                </div>
                <div className="text-sm mb-1">
                    <Link to={`/${post.username}` || '#'} className="font-semibold mr-2">{post.username}</Link>
                    {post.caption}
                </div>
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="text-gray-500 text-xs block mb-1"
                >
                    View all {post.comments} comments
                </button>
                <div className="text-gray-400 text-xs uppercase">{post.timeAgo}</div>

                {/* Comment input */}
                <form onSubmit={handleCommentSubmit} className="mt-3 flex items-center">
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        className="flex-1 text-sm border-none focus:ring-0 p-0"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        className={`text-sm font-semibold ${commentInput.trim() ? 'text-blue-500' : 'text-blue-300'}`}
                        disabled={!commentInput.trim()}
                    >
                        Post
                    </button>
                </form>

                {/* Comments section */}
                {showComments && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                        {Array.from({ length: Math.min(2, post.comments) }).map((_, i) => (
                            <div key={i} className="mb-2 text-sm">
                                <Link to={`/user${i + 1}` || '#'} className="font-semibold mr-2">user{i + 1}</Link>
                                <span>This is a sample comment #{i + 1}</span>
                            </div>
                        ))}
                        {post.comments > 2 && (
                            <button className="text-gray-500 text-xs mt-1">
                                View more comments
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
});

const Header = React.memo(() => {
    const [uiState, setUiState] = useState({
        followers: { open: false, animating: false },
        notifications: { open: false, animating: false },
        messages: { open: false, animating: false },
        hoverStates: {
            logoTag: false,
            notificationBtn: false,
            messageBtn: false
        }
    });

    const messagesRef = useRef(null);
    const notificationRef = useRef(null);
    const followersRef = useRef(null);
    const animationFrameRef = useRef(null);

    const handleHover = (element, isHovering) => {
        setUiState(prev => ({
            ...prev,
            hoverStates: { ...prev.hoverStates, [element]: isHovering }
        }));
    };

    const toggleDropdown = (type) => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        setUiState(prev => {
            const currentlyOpen = prev[type].open;
            if (prev[type].animating) return prev;

            const newState = {
                ...prev,
                followers: { ...prev.followers, open: false, animating: true },
                notifications: { ...prev.notifications, open: false, animating: true },
                messages: { ...prev.messages, open: type === 'messages' ? !currentlyOpen : false, animating: true }
            };

            animationFrameRef.current = requestAnimationFrame(() => {
                setTimeout(() => {
                    setUiState(prev => ({
                        ...prev,
                        [type]: { ...prev[type], animating: false }
                    }));
                }, 300);
            });

            return newState;
        });
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (messagesRef.current && !messagesRef.current.contains(e.target)) {
                setUiState(prev => ({
                    ...prev,
                    messages: { ...prev.messages, open: false }
                }));
            }
        };

        if (uiState.messages.open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [uiState.messages.open]);

    const NotificationIcon = () => (
        <svg width="28" height="28" viewBox="0 0 24 24" className="transition-all duration-150 ease-out">
            <path
                d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
                fill="none"
                stroke={uiState.hoverStates.notificationBtn ? "#4f46e5" : "#6b7280"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle
                cx="19"
                cy="5"
                r="4"
                fill="#ef4444"
                stroke="white"
                strokeWidth="2"
                opacity={uiState.notifications.open ? 1 : 0}
                className="transition-opacity duration-150 ease-out"
            />
        </svg>
    );

    const MessageIcon = () => (
        <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            className="transition-all duration-150 ease-out"
            style={{ transform: 'rotate(45deg)' }}
        >
            <path
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                fill="none"
                stroke={uiState.hoverStates.messageBtn ? "#4f46e5" : "#6b7280"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle
                cx="21"
                cy="3"
                r="4"
                fill="#ef4444"
                stroke="white"
                strokeWidth="2"
                opacity={uiState.messages.open ? 1 : 0}
                className="transition-opacity duration-150 ease-out"
            />
        </svg>
    );

    const getDropdownStyle = (type) => {
        const baseClasses = "transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]";
        const visibilityClasses = uiState[type].open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none";

        return `${baseClasses} ${visibilityClasses}`;
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-5 py-3 mx-auto max-w-7xl">
                {/* Logo Section */}
                <div className="relative flex items-center">
                    <h1 className={`text-2xl font-bold cursor-pointer transition-colors duration-150 ease-out ${uiState.hoverStates.logoTag ? 'text-indigo-600' : 'text-black'}`}>
                        Ininsico
                    </h1>

                    <span
                        className={`absolute -bottom-2 right-0 text-xs font-medium cursor-pointer transition-all duration-150 ease-out ${uiState.hoverStates.logoTag ? 'text-indigo-600 translate-y-0.5' : 'text-gray-500'}`}
                        onClick={() => toggleDropdown('followers')}
                        onMouseEnter={() => handleHover('logoTag', true)}
                        onMouseLeave={() => handleHover('logoTag', false)}
                    >
                        The 3D Social Network
                    </span>

                    {/* Followers Dropdown */}
                    <div
                        ref={followersRef}
                        className={`absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50 ${getDropdownStyle('followers')}`}
                    >
                        <div className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-100 ease-out border-b border-gray-100">
                            <span className="font-semibold text-gray-900">1,234</span> followers
                        </div>
                        <div className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-100 ease-out">
                            <span className="font-semibold text-gray-900">567</span> following
                        </div>
                    </div>
                </div>

                {/* Icons Section */}
                <div className="flex items-center space-x-5">
                    {/* Notification Button */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={() => toggleDropdown('notifications')}
                            onMouseEnter={() => handleHover('notificationBtn', true)}
                            onMouseLeave={() => handleHover('notificationBtn', false)}
                            className="p-1 rounded-full focus:outline-none"
                        >
                            <NotificationIcon />
                        </button>

                        {/* Notifications Dropdown */}
                        <div
                            className={`absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-lg overflow-hidden z-50 ${getDropdownStyle('notifications')}`}
                        >
                            <div className="px-4 py-3 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-900">Notifications</h3>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-100 ease-out border-b border-gray-100"
                                    >
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-gray-300 mr-3 overflow-hidden">
                                                <img
                                                    src={`https://source.unsplash.com/random/100x100/?avatar`}
                                                    alt="User"
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div>
                                                <span className="font-semibold">user{i + 1}</span> liked your post
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Messages Button */}
                    <div className="relative" ref={messagesRef}>
                        <button
                            onClick={() => toggleDropdown('messages')}
                            onMouseEnter={() => handleHover('messageBtn', true)}
                            onMouseLeave={() => handleHover('messageBtn', false)}
                            className="p-1 rounded-full focus:outline-none"
                        >
                            <MessageIcon />
                        </button>

                        {/* Messages Dropdown */}
                        <div
                            className={`absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-lg overflow-hidden z-50 ${getDropdownStyle('messages')}`}
                        >
                            <div className="px-4 py-3 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-900">Messages</h3>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Link
                                        key={i}
                                        to={`/messages/user${i + 1}` || '#'}
                                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-100 ease-out border-b border-gray-100"
                                    >
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-gray-300 mr-3 overflow-hidden">
                                                <img
                                                    src={`https://source.unsplash.com/random/100x100/?avatar`}
                                                    alt="User"
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div>
                                                <span className="font-semibold">user{i + 1}</span>
                                                <p className="text-gray-500 truncate">Hello there! How are you?</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Profile Button */}
                    <Link
                        to="/profile"
                        className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden"
                    >
                        <img
                            src={`https://source.unsplash.com/random/100x100/?avatar`}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    </Link>
                </div>
            </div>
        </header>
    );
});

const Sidebar = React.memo(() => {
    const navItems = [
        { icon: <HomeIcon active />, text: 'Home', path: '/' },
        { icon: <SearchIcon />, text: 'Search', path: '/explore' },
        { icon: <ExploreIcon />, text: 'Explore', path: '/explore' },
        { icon: <ReelsIcon />, text: 'Reels', path: '/reels' },
        { icon: <MessagesIcon />, text: 'Messages', path: '/direct' },
        { icon: <NotificationsIcon />, text: 'Notifications', path: '/activity' },
        { icon: <CreateIcon />, text: 'Create', path: '/create' },
        { icon: <ProfileIcon />, text: 'Profile', path: '/profile' },
        { icon: <MoreIcon />, text: 'More', path: '/more' }
    ];

    return (
        <aside className="fixed left-0 top-0 h-full w-64 border-r border-gray-200 p-4 hidden md:block">
            <div className="flex flex-col space-y-4">
                <h1 className="text-2xl font-bold mb-8">Ininsico</h1>
                {navItems.map((item, index) => (
                    <NavItem key={index} item={item} />
                ))}
            </div>
        </aside>
    );
});

const Stories = React.memo(() => {
    const stories = Array.from({ length: 10 }).map((_, i) => ({
        username: `user${i + 1}`,
        image: `https://source.unsplash.com/random/100x100/?person=${i}`,
        hasUnseenStory: i < 5
    }));

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                {stories.map((story, index) => (
                    <StoryItem key={index} story={story} />
                ))}
            </div>
        </div>
    );
});

const Feed = React.memo(() => {
    const posts = Array.from({ length: 5 }).map((_, i) => ({
        username: `user${i + 1}`,
        image: `https://source.unsplash.com/random/600x600/?photo=${i}`,
        caption: 'This is a sample post caption with some hashtags #example #test',
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 100),
        timeAgo: `${Math.floor(Math.random() * 10) + 1}h ago`,
        location: 'Some Location',
        liked: false,
        saved: false
    }));

    return (
        <div className="max-w-xl mx-auto">
            {posts.map((post, index) => (
                <PostItem key={index} post={post} />
            ))}
        </div>
    );
});

const Ininsico = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="md:pl-64">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <Stories />
                    <Feed />
                </div>
            </div>
            <Sidebar />
        </div>
    );
};

export default Ininsico;

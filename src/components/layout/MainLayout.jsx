import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import IssueBookModal from '../../pages/circulation/IssueBookModal';
import BookFormModal from '../../pages/books/BookFormModal';
import MemberFormModal from '../../pages/members/MemberFormModal';

const MainLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans">
      {/* Sidebar (Desktop fixed + Mobile drawer) */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Sticky Top Header */}
        <Header
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenIssueModal={() => setIsIssueModalOpen(true)}
          onOpenAddBookModal={() => setIsAddBookModalOpen(true)}
          onOpenAddMemberModal={() => setIsAddMemberModalOpen(true)}
        />

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet
            context={{
              openIssueModal: () => setIsIssueModalOpen(true),
              openAddBookModal: () => setIsAddBookModalOpen(true),
              openAddMemberModal: () => setIsAddMemberModalOpen(true),
            }}
          />
        </main>
      </div>

      {/* Global Quick Action Modals */}
      <IssueBookModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
      />

      <BookFormModal
        isOpen={isAddBookModalOpen}
        onClose={() => setIsAddBookModalOpen(false)}
      />

      <MemberFormModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
      />
    </div>
  );
};

export default MainLayout;

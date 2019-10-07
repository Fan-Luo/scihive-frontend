import React from 'react';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import PdfCommenter from '../components/PdfCommenter';
import PrimaryAppBar from '../components/TopBar/PrimaryAppBar';
import { PaperDekstopMenu, PaperMobileMenu } from '../components/TopBar/PaperMenuBar';
import GroupsModal from '../components/GroupsModal';

export default function Paper() {
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (wrapperRef.current)
      disableBodyScroll(wrapperRef.current, {
        allowTouchMove: () => {
          return true;
        },
      });
    return () => clearAllBodyScrollLocks();
  }, []);

  return (
    <React.Fragment>
      <div ref={wrapperRef}>
        <PrimaryAppBar desktopItems={<PaperDekstopMenu />} mobileSubItems={<PaperMobileMenu />} />
        <PdfCommenter />
        <GroupsModal />
      </div>
    </React.Fragment>
  );
}
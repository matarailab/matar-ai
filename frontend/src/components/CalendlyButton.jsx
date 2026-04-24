const CAL_LINK = 'matar-gueye-hy1zhd/discovery-call-matar-ai';
const CAL_URL = `https://cal.com/${CAL_LINK}`;

const CalendlyButton = ({ className, testId, children, tag: Tag = 'button' }) => {
  const open = (e) => {
    e.preventDefault();
    if (window.Cal) {
      window.Cal('openModal', {
        calLink: CAL_LINK,
        config: { layout: 'month_view', theme: 'dark' },
      });
    } else {
      window.open(CAL_URL, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Tag
      onClick={open}
      data-cal-link={CAL_LINK}
      data-cal-config='{"layout":"month_view","theme":"dark"}'
      className={className}
      data-testid={testId}
      type={Tag === 'button' ? 'button' : undefined}
    >
      {children}
    </Tag>
  );
};

export default CalendlyButton;

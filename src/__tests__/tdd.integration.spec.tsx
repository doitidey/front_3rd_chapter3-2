import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ReactElement } from 'react';

import { setupMockHandlerCreation } from '../__mocks__/handlersUtils';
import App from '../App';

const setup = (element: ReactElement) => {
  const user = userEvent.setup();

  return { ...render(<ChakraProvider>{element}</ChakraProvider>), user };
};

describe('반복 유형 선택', () => {
  it('반복 기능을 체크하면 반복 유형이 올바르게 렌더링 되어야 한다.', () => {
    const { user } = setup(<App />);

    const repeatCheckbox = screen.getByLabelText('반복 설정');
    user.click(repeatCheckbox);

    const repeatTypeSelect = screen.getByLabelText('반복 유형');
    expect(repeatTypeSelect).toBeInTheDocument();

    expect(screen.getByText('매일')).toBeInTheDocument();
    expect(screen.getByText('매주')).toBeInTheDocument();
    expect(screen.getByText('매월')).toBeInTheDocument();
    expect(screen.getByText('매년')).toBeInTheDocument();
  });

  it('사용자가 반복 유형을 선택하면 올바르게 업데이트 되어야 한다.', async () => {
    const { user } = setup(<App />);
    const repeatCheckbox = screen.getByLabelText('반복 설정');
    user.click(repeatCheckbox);

    const repeatTypeSelect = screen.getByLabelText('반복 유형');

    await user.selectOptions(repeatTypeSelect, '매월');
    const monthlyOption = screen.getByRole('option', { name: '매월' }) as HTMLOptionElement;
    expect(monthlyOption.selected).toBe(true);
  });
});

describe('반복 간격 설정', () => {
  it('반복 간격을 입력하면 올바르게 설정되어야 한다.', async () => {
    const { user } = setup(<App />);
    const intervalInput = screen.getByLabelText('반복 간격');

    user.click(screen.getByLabelText('반복 일정'));
    await user.type(intervalInput, '2');

    expect(intervalInput).toHaveValue(2);
  });

  it('반복 간격은 1 이상의 숫자여야 한다.', async () => {
    const { user } = setup(<App />);
    const intervalInput = screen.getByLabelText('반복 간격');

    user.click(screen.getByLabelText('반복 일정'));
    await user.type(intervalInput, '0');

    expect(intervalInput).toBeInvalid();
  });
});

describe('반복 일정 표시', () => {
  it('반복 일정은 아이콘으로 표시된다.', async () => {
    setupMockHandlerCreation([
      {
        id: '1',
        title: '기존 회의',
        date: '2024-10-15',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '기존 회의2',
        date: '2024-10-15',
        startTime: '11:00',
        endTime: '12:00',
        description: '기존 팀 미팅 2',
        location: '회의실 C',
        category: '업무 회의',
        repeat: { type: 'weekly', interval: 1 },
        notificationTime: 5,
      },
    ]);

    setup(<App />);
    const eventList = screen.getByTestId('month-view');

    expect(within(eventList).queryByTestId('repeat-icon')).toBeInTheDocument();
  });
});

describe('반복 종료', () => {
  it('반복 종료일을 설정 할 수 있다.', async () => {
    const { user } = setup(<App />);
    const repeatCheckbox = screen.getByLabelText('반복 설정');
    user.click(repeatCheckbox);
    const endDateInput = screen.getByLabelText('반복 종료일');
    await user.type(endDateInput, '2025-06-30');

    expect(endDateInput).toHaveValue('2025-06-30');
  });
});

describe('반복 일정 단일 수정', () => {
  it('단일 일정으로 수정되면 반복 아이콘이 제거된다.', async () => {
    setupMockHandlerCreation([
      {
        id: '1',
        title: '기존 회의',
        date: '2024-10-15',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '기존 회의2',
        date: '2024-10-15',
        startTime: '11:00',
        endTime: '12:00',
        description: '기존 팀 미팅 2',
        location: '회의실 C',
        category: '업무 회의',
        repeat: { type: 'weekly', interval: 1, endDate: '2024-11-20' },
        notificationTime: 5,
      },
    ]);
    setup(<App />);
  });
});

describe('반복 일정 단일 수정', () => {
  // TODO: 반복 일정 단일 수정 테스트 작성
});

describe('반복 일정 단일 삭제', () => {
  // TODO: 반복 일정 단일 삭제 테스트 작성
});

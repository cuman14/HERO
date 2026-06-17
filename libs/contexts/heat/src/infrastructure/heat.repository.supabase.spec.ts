import { TestBed } from '@angular/core/testing';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import { SUPABASE_CLIENT } from '@hero/core';
import { lastValueFrom } from 'rxjs';
import { HeatRepositorySupabase } from './heat.repository.supabase';

setupTestBed();

function createMockSupabase() {
  const single = vi.fn();
  const eq = vi.fn();
  const select = vi.fn();
  const order = vi.fn();
  const limit = vi.fn();

  const then = (
    resolve: (v: unknown) => void,
    reject: (e: unknown) => void,
  ) => single().then(resolve, reject);

  const builder: any = { select, eq, order, limit, single, then };

  select.mockReturnValue(builder);
  eq.mockReturnValue(builder);
  limit.mockReturnValue(builder);
  order.mockReturnValue(builder);
  single.mockResolvedValue({ data: null, error: null });

  const from = vi.fn().mockReturnValue(builder);
  return { from, select, eq, order, limit, single };
}

describe('HeatRepositorySupabase', () => {
  const mockSupabase = createMockSupabase();

  function configureModule() {
    TestBed.configureTestingModule({
      providers: [
        HeatRepositorySupabase,
        { provide: SUPABASE_CLIENT, useValue: mockSupabase },
      ],
    });
    return TestBed.inject(HeatRepositorySupabase);
  }

  beforeEach(() => {
    mockSupabase.single.mockResolvedValue({ data: null, error: null });
  });

  describe('getHeatConfirmationData', () => {
    it('returns null when heat is not found', async () => {
      mockSupabase.single.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'Not found' },
      });

      const repo = configureModule();
      const result = await lastValueFrom(
        repo.getHeatConfirmationData({ heatCode: 'NONEXISTENT' }),
      );

      expect(result).toBeNull();
    });

    it('returns payload with empty judge when no judgeId provided', async () => {
      const heatRow = {
        id: 'heat-1',
        name: 'HEAT-A1',
        status: 'active',
        scheduled_at: '2026-06-17T14:00:00Z',
        wods: {
          id: 'wod-1',
          name: 'Fran',
          type: 'for_time',
          base_config: { time_cap_minutes: 10 },
          categories: { name: 'RX' },
          events: { location: 'Box Madrid' },
        },
      };

      mockSupabase.single
        .mockResolvedValueOnce({ data: heatRow, error: null })
        .mockResolvedValueOnce({ data: [], error: null })
        .mockResolvedValueOnce({ data: [], error: null });

      const repo = configureModule();
      const result = await lastValueFrom(
        repo.getHeatConfirmationData({ heatCode: 'HEAT-A1' }),
      );

      expect(result).not.toBeNull();
      expect(result!.judge).toEqual({ id: '', name: '' });
    });

    it('fetches judge profile and includes it in payload', async () => {
      const heatRow = {
        id: 'heat-1',
        name: 'HEAT-A1',
        status: 'active',
        scheduled_at: '2026-06-17T14:00:00Z',
        wods: {
          id: 'wod-1',
          name: 'Fran',
          type: 'for_time',
          base_config: { time_cap_minutes: 10 },
          categories: { name: 'RX' },
          events: { location: 'Box Madrid' },
        },
      };

      const profileRow = {
        id: 'judge-1',
        display_name: 'Carlos Juez',
      };

      // fetchJudgeProfile is called eagerly before fetchHeat
      mockSupabase.single
        .mockResolvedValueOnce({ data: profileRow, error: null })
        .mockResolvedValueOnce({ data: heatRow, error: null })
        .mockResolvedValueOnce({ data: [], error: null })
        .mockResolvedValueOnce({ data: [], error: null });

      const repo = configureModule();
      const result = await lastValueFrom(
        repo.getHeatConfirmationData({
          heatCode: 'HEAT-A1',
          judgeId: 'judge-1',
        }),
      );

      expect(result).not.toBeNull();
      expect(result!.judge).toEqual({
        id: 'judge-1',
        name: 'Carlos Juez',
      });
    });

    it('returns empty judge when judge profile not found', async () => {
      const heatRow = {
        id: 'heat-1',
        name: 'HEAT-A1',
        status: 'active',
        scheduled_at: '2026-06-17T14:00:00Z',
        wods: {
          id: 'wod-1',
          name: 'Fran',
          type: 'for_time',
          base_config: { time_cap_minutes: 10 },
          categories: { name: 'RX' },
          events: { location: 'Box Madrid' },
        },
      };

      mockSupabase.single
        .mockResolvedValueOnce({
          data: null,
          error: { code: 'PGRST116', message: 'Not found' },
        })
        .mockResolvedValueOnce({ data: heatRow, error: null })
        .mockResolvedValueOnce({ data: [], error: null })
        .mockResolvedValueOnce({ data: [], error: null });

      const repo = configureModule();
      const result = await lastValueFrom(
        repo.getHeatConfirmationData({
          heatCode: 'HEAT-A1',
          judgeId: 'nonexistent',
        }),
      );

      expect(result).not.toBeNull();
      expect(result!.judge).toEqual({ id: '', name: '' });
    });
  });
});

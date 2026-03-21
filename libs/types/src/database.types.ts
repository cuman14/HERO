export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      athletes: {
        Row: {
          bib_number: string | null
          box: string | null
          created_at: string
          email: string | null
          first_name: string | null
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: string
          last_name: string | null
          name: string
          phone: string | null
          status: Database["public"]["Enums"]["athlete_status"]
          updated_at: string
        }
        Insert: {
          bib_number?: string | null
          box?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          last_name?: string | null
          name: string
          phone?: string | null
          status?: Database["public"]["Enums"]["athlete_status"]
          updated_at?: string
        }
        Update: {
          bib_number?: string | null
          box?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          last_name?: string | null
          name?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["athlete_status"]
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          event_id: string
          gender: Database["public"]["Enums"]["gender_type"]
          id: string
          is_team: boolean
          name: string
          order_index: number
          team_size_max: number | null
          team_size_min: number | null
        }
        Insert: {
          created_at?: string
          event_id: string
          gender?: Database["public"]["Enums"]["gender_type"]
          id?: string
          is_team?: boolean
          name: string
          order_index?: number
          team_size_max?: number | null
          team_size_min?: number | null
        }
        Update: {
          created_at?: string
          event_id?: string
          gender?: Database["public"]["Enums"]["gender_type"]
          id?: string
          is_team?: boolean
          name?: string
          order_index?: number
          team_size_max?: number | null
          team_size_min?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          config: Json
          created_at: string
          created_by: string
          date: string
          id: string
          location: string | null
          name: string
          ranking_method: Database["public"]["Enums"]["ranking_method"]
          sport_type: Database["public"]["Enums"]["sport_type"]
          status: Database["public"]["Enums"]["event_status"]
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          created_by: string
          date: string
          id?: string
          location?: string | null
          name: string
          ranking_method?: Database["public"]["Enums"]["ranking_method"]
          sport_type: Database["public"]["Enums"]["sport_type"]
          status?: Database["public"]["Enums"]["event_status"]
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          created_by?: string
          date?: string
          id?: string
          location?: string | null
          name?: string
          ranking_method?: Database["public"]["Enums"]["ranking_method"]
          sport_type?: Database["public"]["Enums"]["sport_type"]
          status?: Database["public"]["Enums"]["event_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      heat_athletes: {
        Row: {
          athlete_id: string
          heat_id: string
          judge_id: string | null
          lane: number | null
          team_id: string | null
        }
        Insert: {
          athlete_id: string
          heat_id: string
          judge_id?: string | null
          lane?: number | null
          team_id?: string | null
        }
        Update: {
          athlete_id?: string
          heat_id?: string
          judge_id?: string | null
          lane?: number | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "heat_athletes_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "heat_athletes_heat_id_fkey"
            columns: ["heat_id"]
            isOneToOne: false
            referencedRelation: "heats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "heat_athletes_judge_id_fkey"
            columns: ["judge_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "heat_athletes_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      heats: {
        Row: {
          created_at: string
          finished_at: string | null
          id: string
          name: string
          scheduled_at: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["heat_status"]
          wod_id: string
        }
        Insert: {
          created_at?: string
          finished_at?: string | null
          id?: string
          name: string
          scheduled_at?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["heat_status"]
          wod_id: string
        }
        Update: {
          created_at?: string
          finished_at?: string | null
          id?: string
          name?: string
          scheduled_at?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["heat_status"]
          wod_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "heats_wod_id_fkey"
            columns: ["wod_id"]
            isOneToOne: false
            referencedRelation: "wods"
            referencedColumns: ["id"]
          },
        ]
      }
      levels: {
        Row: {
          category_id: string
          code: string
          color: string
          created_at: string
          id: string
          name: string
          order_index: number
        }
        Insert: {
          category_id: string
          code: string
          color?: string
          created_at?: string
          id?: string
          name: string
          order_index?: number
        }
        Update: {
          category_id?: string
          code?: string
          color?: string
          created_at?: string
          id?: string
          name?: string
          order_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "levels_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          event_ids: string[]
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name: string
          event_ids?: string[]
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          event_ids?: string[]
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      score_stations: {
        Row: {
          created_at: string
          cumulative_seconds: number | null
          id: string
          label: string
          score_id: string
          split_seconds: number | null
          station_index: number
          status: Database["public"]["Enums"]["station_status"]
        }
        Insert: {
          created_at?: string
          cumulative_seconds?: number | null
          id?: string
          label: string
          score_id: string
          split_seconds?: number | null
          station_index: number
          status?: Database["public"]["Enums"]["station_status"]
        }
        Update: {
          created_at?: string
          cumulative_seconds?: number | null
          id?: string
          label?: string
          score_id?: string
          split_seconds?: number | null
          station_index?: number
          status?: Database["public"]["Enums"]["station_status"]
        }
        Relationships: [
          {
            foreignKeyName: "score_stations_score_id_fkey"
            columns: ["score_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["score_id"]
          },
          {
            foreignKeyName: "score_stations_score_id_fkey"
            columns: ["score_id"]
            isOneToOne: false
            referencedRelation: "scores"
            referencedColumns: ["id"]
          },
        ]
      }
      scores: {
        Row: {
          athlete_id: string
          confirmed_at: string | null
          created_at: string
          dispute_reason: string | null
          heat_id: string | null
          id: string
          judge_id: string | null
          level_id: string
          notes: string | null
          penalty_reps: number
          status: Database["public"]["Enums"]["score_status"]
          submitted_at: string | null
          team_id: string | null
          tiebreak_seconds: number | null
          updated_at: string
          value: Json
          wod_id: string
        }
        Insert: {
          athlete_id: string
          confirmed_at?: string | null
          created_at?: string
          dispute_reason?: string | null
          heat_id?: string | null
          id?: string
          judge_id?: string | null
          level_id: string
          notes?: string | null
          penalty_reps?: number
          status?: Database["public"]["Enums"]["score_status"]
          submitted_at?: string | null
          team_id?: string | null
          tiebreak_seconds?: number | null
          updated_at?: string
          value?: Json
          wod_id: string
        }
        Update: {
          athlete_id?: string
          confirmed_at?: string | null
          created_at?: string
          dispute_reason?: string | null
          heat_id?: string | null
          id?: string
          judge_id?: string | null
          level_id?: string
          notes?: string | null
          penalty_reps?: number
          status?: Database["public"]["Enums"]["score_status"]
          submitted_at?: string | null
          team_id?: string | null
          tiebreak_seconds?: number | null
          updated_at?: string
          value?: Json
          wod_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scores_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scores_heat_id_fkey"
            columns: ["heat_id"]
            isOneToOne: false
            referencedRelation: "heats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scores_judge_id_fkey"
            columns: ["judge_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scores_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scores_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scores_wod_id_fkey"
            columns: ["wod_id"]
            isOneToOne: false
            referencedRelation: "wods"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          athlete_id: string | null
          bib_number: string | null
          created_at: string
          id: string
          name: string
          role: string | null
          team_id: string
        }
        Insert: {
          athlete_id?: string | null
          bib_number?: string | null
          created_at?: string
          id?: string
          name: string
          role?: string | null
          team_id: string
        }
        Update: {
          athlete_id?: string | null
          bib_number?: string | null
          created_at?: string
          id?: string
          name?: string
          role?: string | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          bib_number: string | null
          box: string | null
          category_id: string
          created_at: string
          event_id: string
          id: string
          level_id: string
          name: string
          status: Database["public"]["Enums"]["athlete_status"]
          updated_at: string
        }
        Insert: {
          bib_number?: string | null
          box?: string | null
          category_id: string
          created_at?: string
          event_id: string
          id?: string
          level_id: string
          name: string
          status?: Database["public"]["Enums"]["athlete_status"]
          updated_at?: string
        }
        Update: {
          bib_number?: string | null
          box?: string | null
          category_id?: string
          created_at?: string
          event_id?: string
          id?: string
          level_id?: string
          name?: string
          status?: Database["public"]["Enums"]["athlete_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
        ]
      }
      wod_level_configs: {
        Row: {
          config: Json
          created_at: string
          description_override: string | null
          id: string
          level_id: string
          updated_at: string
          wod_id: string
        }
        Insert: {
          config?: Json
          created_at?: string
          description_override?: string | null
          id?: string
          level_id: string
          updated_at?: string
          wod_id: string
        }
        Update: {
          config?: Json
          created_at?: string
          description_override?: string | null
          id?: string
          level_id?: string
          updated_at?: string
          wod_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wod_level_configs_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wod_level_configs_wod_id_fkey"
            columns: ["wod_id"]
            isOneToOne: false
            referencedRelation: "wods"
            referencedColumns: ["id"]
          },
        ]
      }
      wods: {
        Row: {
          base_config: Json
          category_id: string
          created_at: string
          description: string | null
          event_id: string
          id: string
          name: string
          order_index: number
          points_table: Json | null
          scoring_direction: Database["public"]["Enums"]["scoring_direction"]
          type: Database["public"]["Enums"]["wod_type"]
          updated_at: string
        }
        Insert: {
          base_config?: Json
          category_id: string
          created_at?: string
          description?: string | null
          event_id: string
          id?: string
          name: string
          order_index?: number
          points_table?: Json | null
          scoring_direction?: Database["public"]["Enums"]["scoring_direction"]
          type: Database["public"]["Enums"]["wod_type"]
          updated_at?: string
        }
        Update: {
          base_config?: Json
          category_id?: string
          created_at?: string
          description?: string | null
          event_id?: string
          id?: string
          name?: string
          order_index?: number
          points_table?: Json | null
          scoring_direction?: Database["public"]["Enums"]["scoring_direction"]
          type?: Database["public"]["Enums"]["wod_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wods_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wods_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      leaderboard: {
        Row: {
          athlete_id: string | null
          bib_number: string | null
          box: string | null
          category_id: string | null
          category_name: string | null
          competitor_name: string | null
          gender: Database["public"]["Enums"]["gender_type"] | null
          level_code: string | null
          level_color: string | null
          level_id: string | null
          level_name: string | null
          penalty_reps: number | null
          rank_in_category: number | null
          rank_in_level: number | null
          score_id: string | null
          scoring_direction:
            | Database["public"]["Enums"]["scoring_direction"]
            | null
          status: Database["public"]["Enums"]["score_status"] | null
          submitted_at: string | null
          team_id: string | null
          tiebreak_seconds: number | null
          value: Json | null
          wod_id: string | null
          wod_name: string | null
          wod_type: Database["public"]["Enums"]["wod_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "scores_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scores_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scores_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scores_wod_id_fkey"
            columns: ["wod_id"]
            isOneToOne: false
            referencedRelation: "wods"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      is_assigned_judge: { Args: { p_athlete_id: string }; Returns: boolean }
    }
    Enums: {
      athlete_status: "registered" | "checked_in" | "withdrawn"
      event_status: "draft" | "active" | "finished"
      gender_type: "male" | "female" | "mixed" | "open"
      heat_status: "pending" | "active" | "finished"
      ranking_method: "points" | "cumulative" | "last_wod"
      score_status: "draft" | "submitted" | "confirmed" | "disputed" | "void"
      scoring_direction: "higher_is_better" | "lower_is_better"
      sport_type: "crossfit" | "hyrox"
      station_status: "pending" | "confirmed" | "dnf"
      user_role: "admin" | "judge"
      wod_type:
        | "amrap"
        | "for_time"
        | "max_weight"
        | "ladder"
        | "emom"
        | "hyrox_race"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      athlete_status: ["registered", "checked_in", "withdrawn"],
      event_status: ["draft", "active", "finished"],
      gender_type: ["male", "female", "mixed", "open"],
      heat_status: ["pending", "active", "finished"],
      ranking_method: ["points", "cumulative", "last_wod"],
      score_status: ["draft", "submitted", "confirmed", "disputed", "void"],
      scoring_direction: ["higher_is_better", "lower_is_better"],
      sport_type: ["crossfit", "hyrox"],
      station_status: ["pending", "confirmed", "dnf"],
      user_role: ["admin", "judge"],
      wod_type: [
        "amrap",
        "for_time",
        "max_weight",
        "ladder",
        "emom",
        "hyrox_race",
      ],
    },
  },
} as const

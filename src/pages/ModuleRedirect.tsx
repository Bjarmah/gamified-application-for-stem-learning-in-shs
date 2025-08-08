import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const ModuleRedirect: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Loading module • STEM Learner";
  }, []);

  useEffect(() => {
    const go = async () => {
      if (!moduleId) return;
      const { data, error } = await supabase
        .from("modules")
        .select("id, subject_id")
        .eq("id", moduleId)
        .maybeSingle();

      if (error || !data) {
        navigate("/not-found", { replace: true });
        return;
      }

      navigate(`/subjects/${data.subject_id}/${data.id}` , { replace: true });
    };
    go();
  }, [moduleId, navigate]);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-8 w-64" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton className="h-64 w-full" />
        </div>
        <div>
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  );
};

export default ModuleRedirect;

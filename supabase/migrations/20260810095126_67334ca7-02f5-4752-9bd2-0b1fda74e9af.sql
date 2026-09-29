CREATE POLICY "midias_public_read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'midias');
CREATE POLICY "midias_gestor_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'midias' AND public.is_gestor(auth.uid()));
CREATE POLICY "midias_gestor_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'midias' AND public.is_gestor(auth.uid()));
CREATE POLICY "midias_gestor_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'midias' AND public.is_gestor(auth.uid()));
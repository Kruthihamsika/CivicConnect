import { supabase } from "./supabase";
import { autoAssignComplaint } from './smartAssign';

export async function getComplaints() {
  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}

export async function getWorkers() {
  const { data, error } = await supabase
    .from('workers')
    .select('*');

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}

export async function getClusters() {
  const { data, error } = await supabase
    .from('clusters')
    .select('*');

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}

export async function updateComplaint(
  complaintId: string,
  updates: any
) {
  const { error } = await supabase
    .from('complaints')
    .update(updates)
    .eq('id', complaintId);

  if (error) {
    console.log(error);
  }
}

export async function createComplaint(
  complaintData: any
) {
  try {
    // CREATE COMPLAINT
    const {
      data,
      error,
    } = await supabase
      .from('complaints')
      .insert([complaintData])
      .select()
      .single();

    if (error) {
      console.log(error);
      return null;
    }

    // AUTO ASSIGN
    await autoAssignComplaint(
      data.id
    );

    console.log(
      'Complaint created and auto assigned'
    );

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
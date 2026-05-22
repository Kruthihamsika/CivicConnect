import { supabase } from './supabase';

export async function loginWorker(
  phone: string
) {
  const { data, error } =
    await supabase
      .from('workers')
      .select('*')
      .eq('phone', phone)
      .single();

  if (error) {
    console.log(error);
    throw error;
  }

  return data;
}

export async function fetchAssignedComplaints(
  workerId: string
) {
  const { data, error } =
    await supabase
      .from('complaints')
      .select('*')
      .eq(
        'assigned_worker_id',
        workerId
      )
      .order('created_at', {
        ascending: false,
      });

  if (error) {
    console.log(error);
    throw error;
  }

  return data;
}

export async function updateComplaintStatus(
  complaintId: string,
  status: string
) {
  const { data, error } =
    await supabase
      .from('complaints')
      .update({
        status,
      })
      .eq('id', complaintId);

  if (error) {
    console.log(error);
    throw error;
  }

  return data;
}

export async function uploadCompletionImage(
  file: File
) {
  try {
    const fileName = `${Date.now()}-${file.name}`;

    console.log(
      'Uploading:',
      fileName
    );

    const { data, error } =
      await supabase.storage
        .from(
          'complaint-images'
        )
        .upload(
          fileName,
          file
        );

    if (error) {
      console.log(
        'Upload error:',
        error
      );

      throw error;
    }

    console.log(
      'Upload success:',
      data
    );

    const publicUrlData =
      supabase.storage
        .from(
          'complaint-images'
        )
        .getPublicUrl(
          fileName
        );

    console.log(
      'Public URL:',
      publicUrlData
    );

    return publicUrlData.data.publicUrl;
  } catch (error) {
    console.log(
      'Storage failed:',
      error
    );

    throw error;
  }
}

export async function completeComplaint(
  complaintId: string,
  imageUrl: string
) {
  console.log(
    'Saving complaint:',
    complaintId,
    imageUrl
  );

  const { data, error } =
    await supabase
      .from('complaints')
      .update({
        status:
          'awaiting_verification',

        resolved_image_url:
          imageUrl,
      })
      .eq('id', complaintId);

  if (error) {
    console.log(
      'DB update error:',
      error
    );

    throw error;
  }

  console.log(
    'Complaint updated:',
    data
  );

  return data;
}
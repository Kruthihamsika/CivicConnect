import { supabase } from './supabase';

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export async function autoAssignComplaint(
  complaintId: string
) {
  try {
    console.log('Starting assignment for:', complaintId);

    // GET COMPLAINT
    const { data: complaint, error: complaintError } =
      await supabase
        .from('complaints')
        .select('*')
        .eq('id', complaintId)
        .single();

    if (complaintError || !complaint) {
      console.error('Complaint fetch failed');
      return;
    }

    console.log('Complaint:', complaint);

    // GET CLUSTERS
    const { data: clusters, error: clusterError } =
      await supabase
        .from('clusters')
        .select('*');

    if (clusterError || !clusters) {
      console.error('Cluster fetch failed');
      return;
    }

    console.log('Clusters:', clusters);

    // FIND NEAREST CLUSTER
    let nearestCluster: any = null;
    let minClusterDistance = Infinity;

    for (const cluster of clusters) {
      const distance = calculateDistance(
        complaint.latitude,
        complaint.longitude,
        cluster.center_latitude,
        cluster.center_longitude
      );

      console.log(
        `Cluster ${cluster.name} distance:`,
        distance
      );

      if (
        distance <= cluster.radius_km &&
        distance < minClusterDistance
      ) {
        minClusterDistance = distance;
        nearestCluster = cluster;
      }
    }

    if (!nearestCluster) {
      console.error('No matching cluster found');
      return;
    }

    console.log('Nearest Cluster:', nearestCluster);

    // GET AVAILABLE WORKERS
    const { data: workers, error: workerError } =
      await supabase
        .from('workers')
        .select('*')
        .eq('cluster_id', nearestCluster.id)
        .eq('status', 'available');

    if (workerError || !workers || workers.length === 0) {
      console.error('No available workers');
      return;
    }

    console.log('Workers:', workers);

    // FIND NEAREST WORKER
    let nearestWorker: any = null;
    let minWorkerDistance = Infinity;

    for (const worker of workers) {
      const distance = calculateDistance(
        complaint.latitude,
        complaint.longitude,
        worker.latitude,
        worker.longitude
      );

      console.log(
        `Worker ${worker.name} distance:`,
        distance
      );

      if (distance < minWorkerDistance) {
        minWorkerDistance = distance;
        nearestWorker = worker;
      }
    }

    if (!nearestWorker) {
      console.error('No nearest worker found');
      return;
    }

    console.log('Nearest Worker:', nearestWorker);

    // UPDATE COMPLAINT
    const { error: updateError } = await supabase
      .from('complaints')
      .update({
        assigned_worker_id: nearestWorker.id,
        cluster_id: nearestCluster.id,
        status: 'assigned'
      })
      .eq('id', complaintId);

    if (updateError) {
      console.error('Complaint update failed');
      return;
    }

    console.log('Complaint updated successfully');

    // CREATE ASSIGNMENT
    await supabase.from('assignments').insert({
      complaint_id: complaint.id,
      worker_id: nearestWorker.id,
      assigned_at: new Date().toISOString(),
      status: 'assigned'
    });

    // UPDATE WORKER STATUS
    await supabase
      .from('workers')
      .update({
        status: 'busy'
      })
      .eq('id', nearestWorker.id);

    console.log('Assignment completed');
  } catch (error) {
    console.error('Assignment Error:', error);
  }
}
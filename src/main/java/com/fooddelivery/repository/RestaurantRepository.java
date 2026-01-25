package com.fooddelivery.repository;

import com.fooddelivery.model.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface RestaurantRepository extends MongoRepository<Restaurant, String> {
    Page<Restaurant> findByIsActiveTrue(Pageable pageable);
    List<Restaurant> findByOwnerId(String ownerId);

    @Query("{ 'isActive': true, 'cuisines': { $in: ?0 } }")
    Page<Restaurant> findByCuisines(List<String> cuisines, Pageable pageable);

    @Query("{ 'isActive': true, 'name': { $regex: ?0, $options: 'i' } }")
    Page<Restaurant> searchByName(String name, Pageable pageable);
}
